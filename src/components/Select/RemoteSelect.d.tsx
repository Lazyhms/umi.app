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

    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [pageIndex, setPageIndex] = useState(remote?.pageIndex ?? 0);
    const [remoteOption, setRemoteOption] = useState<RemoteOption>({ option: options ?? [] });

    const getItems = async () => {
        if (loading) {
            return;
        }
        if ((remote?.url ?? '') === '') {
            return;
        }

        const currentLength = remoteOption.option.length - (options?.length ?? 0);
        if (currentLength > totalCount) {
            return;
        }

        setLoading(true);

        await request(remote!.url!, {
            params: {
                pageIndex,
                pageSize: remote!.pageSize ?? 10,
            },
            responseInterceptors: remote?.responseInterceptors === null ? [] : [remote!.responseInterceptors!],
        }).then((e) => {
            setPageIndex(pageIndex + 1);
            setTotalCount(e.totalCount);
            setRemoteOption({
                option: [...remoteOption.option!, ...e.data],
            });
        }).then(() => {
            setLoading(false);
        });
    };

    const handleDropdownVisibleChange = async (open: boolean) => {
        if (open && (remoteOption?.option.length ?? 0) === (options?.length ?? 0) && (remote ?? '') !== '') {
            await getItems();
        }
    };

    const handlePopupScroll = async (e: any) => {
        e.persist();

        const { scrollTop, offsetHeight, scrollHeight } = e.target;
        if (scrollTop + offsetHeight === scrollHeight) {
            await getItems();
        }
    };

    useImperativeHandle(ref, () => (remoteOption));

    return (
        <Select
            {...props}
            loading={loading}
            options={remoteOption.option}
            onPopupScroll={handlePopupScroll}
            onDropdownVisibleChange={handleDropdownVisibleChange}
        />
    );
});

export default RemoteSelect;
