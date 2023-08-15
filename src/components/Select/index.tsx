import { Method } from 'axios'
import { Select, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { AxiosResponse, request } from '@umijs/max';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

type Model = "append" | "replace";

type IErrorInterceptor = (error: Error) => Promise<Error>;
type IResponseInterceptor = <T = any>(response: AxiosResponse<T>) => AxiosResponse<T>;
type IResponseInterceptorTuple = [IResponseInterceptor, IErrorInterceptor] | [IResponseInterceptor] | IResponseInterceptor

interface RemoteConfig {
    url: string | null;
    method?: Method | string
    pageIndex?: number;
    pageSize?: number;
    immediately?: boolean;
    responseInterceptors?: IResponseInterceptorTuple[];
}

interface RemoteSelectProps extends Omit<SelectProps, "onInputKeyDown" | "onPopupScroll" | "onDropdownVisibleChange"> {
    remote?: RemoteConfig;
}

export interface RemoteOption {
    options: DefaultOptionType[]
}

const RemoteSelect = forwardRef<RemoteOption, RemoteSelectProps>((props, ref) => {
    const { options, remote } = props;

    const [loading, setLoading] = useState(false);
    const [remoteOption, setRemoteOption] = useState<RemoteOption>({
        options: options ?? []
    });

    useImperativeHandle(ref, () => ({ options: remoteOption.options }));

    const refTotalCount = useRef(0);

    const refRequestParams = useRef({
        search: undefined,
        pageSize: remote!.pageSize ?? 10,
        pageIndex: remote?.pageIndex ?? 1,
    })

    const handleClear = () => {
        refTotalCount.current = 0;
        refRequestParams.current.pageIndex = 1;
        refRequestParams.current.search = undefined;

        setRemoteOption({
            options: options ?? []
        });
    }

    const getRemoteOptions = async (model: Model) => {
        if (loading) {
            return;
        }
        if ((remote?.url ?? '') === '') {
            return;
        }

        const currentLength = remoteOption.options.length - (options?.length ?? 0);
        if (currentLength !== 0 && refTotalCount.current !== 0 && currentLength >= refTotalCount.current) {
            return;
        }

        setLoading(true)

        await request(remote!.url!, {
            params: refRequestParams.current,
            method: remote!.method,
            responseInterceptors: remote!.responseInterceptors,
        }).then((e: { totalCount: number; data: any; }) => {
            refTotalCount.current = e.totalCount;
            refRequestParams.current.pageIndex += 1;

            if (model === 'append') {
                setRemoteOption({
                    options: [...remoteOption.options!, ...e.data]
                });
            } else if (model === 'replace') {
                setRemoteOption({
                    options: e.data
                });
            }
        }).then(() => {
            setLoading(false);
        });
    };

    const handlePopupScroll = async (event: any) => {
        event.persist();

        const { scrollTop, offsetHeight, scrollHeight } = event.target;
        if (scrollTop + offsetHeight === scrollHeight) {
            await getRemoteOptions('append');
        }
    };

    const handleEnterKeyDown = async (event: any) => {
        event.persist();

        const search = event.target.value;
        if (event.code === "Enter" && search !== '') {
            refRequestParams.current.pageIndex = 1;
            refRequestParams.current.search = search;

            await getRemoteOptions('replace');
        }
    }

    const handleDropdownVisibleChange = async (open: boolean) => {
        if (open && (remote?.immediately ?? false) && (remoteOption.options.length ?? 0) === (options?.length ?? 0) && (remote ?? '') !== '') {
            await getRemoteOptions('append');
        }
    };

    return (
        <Select
            {...props}
            showSearch={true}
            allowClear={true}
            loading={loading}
            filterOption={false}
            onClear={handleClear}
            options={remoteOption.options}
            onPopupScroll={handlePopupScroll}
            onInputKeyDown={handleEnterKeyDown}
            onDropdownVisibleChange={handleDropdownVisibleChange}
        />
    );
});

export default RemoteSelect;
