import { AxiosResponse, request } from '@umijs/max';
import { Select, SelectProps } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';

type IResponseInterceptor = <T = any>(
    response: AxiosResponse<T>,
) => AxiosResponse<T>;

interface remoteConfig {
    url: string | null;
    pageSize?: number;
    responseInterceptors?: IResponseInterceptor;
}

export interface OptionItem {
    data: any[];
    totalPage: number;
}

interface RemoteSelectProps extends SelectProps {
    remote?: remoteConfig;
}

const RemoteSelect = forwardRef<OptionItem, RemoteSelectProps>((props, ref) => {
    const { options, remote } = props;

    const [pageIndex, setItemPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [optionsItem, setOptionsItem] = useState<OptionItem>({
        data: options ?? [],
        totalPage: 1,
    });

    const getItems = async () => {
        if (loading) {
            return;
        }

        if ((remote?.url ?? '') === '') {
            return;
        }

        const tempPageIndex = pageIndex + 1;

        if (tempPageIndex > optionsItem.totalPage) {
            return;
        }

        setItemPage(tempPageIndex);

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
            timeout: 50000
        }).then((e) => {
            setOptionsItem({
                data: [...optionsItem.data!, ...e.data],
                totalPage: e.totalPage,
            });

            setLoading(false);
        });
    };

    const handleDropdownVisibleChange = async (open: boolean) => {
        if (
            open &&
            (optionsItem?.data.length ?? 0) === (options?.length ?? 0) &&
            (remote ?? '') !== ''
        ) {
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
            options={optionsItem.data}
            loading={loading}
            onPopupScroll={handlePopupScroll}
            onDropdownVisibleChange={handleDropdownVisibleChange}
        />
    );
});

export default RemoteSelect;
