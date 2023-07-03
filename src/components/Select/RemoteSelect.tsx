import { AxiosResponse, request } from '@umijs/max';
import { Select, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { forwardRef, useImperativeHandle, useState } from 'react';

type IResponseInterceptor = <T = any>(
    response: AxiosResponse<T>,
) => AxiosResponse<T>;

interface remoteConfig {
    url: string | null;
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

    const [pageIndex, setPageIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [optionsItem, setOptionsItem] = useState<RemoteOption>({ option: options ?? [] });
    const [totalPage, setTotalPage] = useState(1);

    const getItems = async () => {
        if (loading) {
            return;
        }
        if ((remote?.url ?? '') === '') {
            return;
        }

        const tempPageIndex = pageIndex + 1;
        if (tempPageIndex > totalPage) {
            return;
        }

        setLoading(true);

        await request(remote!.url!, {
            params: {
                pageIndex,
                pageSize: remote!.pageSize ?? 10,
            },
            responseInterceptors:
                remote?.responseInterceptors === null
                    ? []
                    : [remote!.responseInterceptors!],
        }).then((e) => {
            setPageIndex(tempPageIndex);
            setTotalPage(e.totalPage);
            setOptionsItem({
                option: [...optionsItem.option!, ...e.data],
            });
        }).then(() => {
            setLoading(false);
        });
    };

    const handleDropdownVisibleChange = async (open: boolean) => {
        if (open && (optionsItem?.option.length ?? 0) === (options?.length ?? 0) && (remote ?? '') !== '') {
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

    useImperativeHandle(ref, () => (optionsItem));

    return (
        <Select
            {...props}
            loading={loading}
            options={optionsItem.option}
            onPopupScroll={handlePopupScroll}
            onDropdownVisibleChange={handleDropdownVisibleChange}
        />
    );
});

export default RemoteSelect;
