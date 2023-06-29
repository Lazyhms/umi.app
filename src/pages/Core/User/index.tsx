import { ActionType, PageContainer, ProDescriptionsItemProps, ProTable } from "@ant-design/pro-components";
import { Divider } from "antd";
import { useRef, useState } from "react";

const TableList: React.FC<unknown> = () => {
    const actionRef = useRef<ActionType>();
    const [stepFormValues, setStepFormValues] = useState({});
    const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

    const columns: ProDescriptionsItemProps<any>[] = [
        {
            title: '名称',
            dataIndex: 'name',
            // tip: '名称是唯一的 key',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '名称为必填项',
                    },
                ],
            },
        },
        {
            title: '昵称',
            dataIndex: 'nickName',
            valueType: 'text',
        },
        {
            title: '性别',
            dataIndex: 'gender',
            hideInForm: true,
            valueEnum: {
                0: { text: '男', status: 'MALE' },
                1: { text: '女', status: 'FEMALE' },
            },
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => (
                <>
                    <a
                        onClick={() => {
                            handleUpdateModalVisible(true);
                            setStepFormValues(record);
                        }}
                    >
                        配置
                    </a>
                    <Divider type="vertical" />
                    <a href="">订阅警报</a>
                </>
            ),
        },
    ]

    return (
        <PageContainer >
            <ProTable headerTitle='列表' actionRef={actionRef} columns={columns}>

            </ProTable>
        </PageContainer>
    );
}

export default TableList;