import { AxiosResponse, request } from '@umijs/max';
import { Select, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { forwardRef, useImperativeHandle, useState } from 'react';

type IResponseInterceptor = <T = any>(
    response: AxiosResponse<T>,
) => AxiosResponse<T>;

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
    option: DefaultOptionType[]
}

const RemoteSelect = forwardRef<RemoteOption, RemoteSelectProps>((props, ref) => {
    const { options, remote } = props;

    const [search, setSearch] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [pageIndex, setPageIndex] = useState(remote?.pageIndex ?? 1);
    const [remoteOption, setRemoteOption] = useState<RemoteOption>({ option: options ?? [] });

    const getItems = async (mode: 'append' | 'replace') => {
        if (loading) {
            return;
        }
        if ((remote?.url ?? '') === '') {
            return;
        }

        const currentLength = remoteOption.option.length - (options?.length ?? 0);
        if (currentLength !== 0 && totalCount !== 0 && currentLength >= totalCount) {
            return;
        }

        setLoading(true);

        await request(remote!.url!, {
            params: {
                pageIndex,
                pageSize: remote!.pageSize ?? 10,
                search
            },
            responseInterceptors: remote?.responseInterceptors === null ? [] : [remote!.responseInterceptors!],
        }).then((e) => {
            setPageIndex(pageIndex + 1);
            setTotalCount(e.totalCount);
            setRemoteOption({
                option: mode === 'append' ? [...remoteOption.option!, ...e.data] : [...e.data],
            });
        }).then(() => {
            setLoading(false);
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

            console.log(search);

            setSearch(search);
            setPageIndex(1);
            setRemoteOption({ option: options ?? [] });

            await getItems('replace');
        }
    }

    const handleDropdownVisibleChange = async (open: boolean) => {
        if (open && (remoteOption?.option.length ?? 0) === (options?.length ?? 0) && (remote ?? '') !== '') {
            await getItems('append');
        }
    };

    useImperativeHandle(ref, () => (remoteOption));

    return (
        <Select
            {...props}
            showSearch={true}
            allowClear={true}
            loading={loading}
            filterOption={(input, option) =>
                ((option?.label ?? '') as string).toLowerCase().includes(input.toLowerCase())
            }
            options={remoteOption.option}
            onKeyDown={handleEnterKeyDown}
            onPopupScroll={handlePopupScroll}
            onDropdownVisibleChange={handleDropdownVisibleChange}
        />
    );
});

export default RemoteSelect;
