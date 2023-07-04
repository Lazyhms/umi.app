import { AxiosResponse, request } from '@umijs/max';
import { Select, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

type IResponseInterceptor = <T = any>(
    response: AxiosResponse<T>,
) => AxiosResponse<T>;

interface Params {
    search?: string | null | undefined,
    pageSize: number,
    pageIndex: number,
    totalCount: number,
}

interface remoteConfig {
    url: string | null;
    pageIndex?: number;
    pageSize?: number;
    responseInterceptors?: IResponseInterceptor;
}

interface RemoteSelectProps extends SelectProps {
    remote?: remoteConfig;
}

export interface RemoteOption {
    options: DefaultOptionType[]
}

const RemoteSelect = forwardRef<RemoteOption, RemoteSelectProps>((props, ref) => {
    const { options, remote } = props;

    const refRequestParams = useRef<Omit<Params, "totalCount">>({
        search: undefined,
        pageSize: remote!.pageSize ?? 10,
        pageIndex: remote?.pageIndex ?? 1,
    })

    const refTotalCount = useRef(0);

    const [render, setRender] = useState({
        loading: false,
        options: options ?? [],
    });

    const getItems = async (mode: 'append' | 'replace') => {
        if (render.loading) {
            return;
        }
        if ((remote?.url ?? '') === '') {
            return;
        }

        const currentLength = render.options.length - (options?.length ?? 0);
        if (currentLength !== 0 && refTotalCount.current !== 0 && currentLength >= refTotalCount.current) {
            return;
        }

        render.loading = true;

        await request(remote!.url!, {
            params: refRequestParams.current,
            responseInterceptors: remote?.responseInterceptors === null ? [] : [remote!.responseInterceptors!],
        }).then((e) => {
            refTotalCount.current = e.totalCount;
            refRequestParams.current.pageIndex += 1;
            setRender({
                loading: false,
                options: mode === 'append' ? [...render.options!, ...e.data] : [...e.data]
            });
        });
    };

    const handlePopupScroll = async (event: any) => {
        event.persist();

        const { scrollTop, offsetHeight, scrollHeight } = event.target;
        if (scrollTop + offsetHeight === scrollHeight) {
            await getItems('append');
        }
    };

    const handleEnterKeyDown = async (event: any) => {
        event.persist();

        const search = event.target.value;
        if (event.code === "Enter" && search !== '') {
            refRequestParams.current.pageIndex = 1;
            refRequestParams.current.search = search;
            setRender({ loading: false, options: options ?? [] });

            await getItems('replace');
        }
    }

    const handleClear = () => {
        refTotalCount.current = 0;
        refRequestParams.current.pageIndex = 1;
        refRequestParams.current.search = undefined;
        setRender({ loading: false, options: options ?? [] });
    }

    const handleDropdownVisibleChange = async (open: boolean) => {
        if (open && (render.options.length ?? 0) === (options?.length ?? 0) && (remote ?? '') !== '') {
            await getItems('append');
        }
    };

    useImperativeHandle(ref, () => ({ options: render.options }));

    return (
        <Select
            {...props}
            showSearch={true}
            allowClear={true}
            loading={render.loading}
            filterOption={(input, option) =>
                ((option?.label ?? '') as string).toLowerCase().includes(input.toLowerCase())
            }
            onClear={handleClear}
            options={render.options}
            onKeyDown={handleEnterKeyDown}
            onPopupScroll={handlePopupScroll}
            onDropdownVisibleChange={handleDropdownVisibleChange}
        />
    );
});

export default RemoteSelect;
