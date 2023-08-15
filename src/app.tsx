import {
    GithubFilled,
    InfoCircleFilled, QuestionCircleFilled
} from "@ant-design/icons";
import { RunTimeLayoutConfig } from "@umijs/max";
import { message } from "antd";

export const layout: RunTimeLayoutConfig = () => {
    return {
        avatarProps: {
            src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
            title: '妮可妮可',
            size: 'small',
            onClick: () => {
                message.warning("111");
            }
        },
        menu: {
            locale: false
        },
        theme: "light",
        actionsRender: (props: any) => {
            if (props.isMobile) {
                return [];
            }
            return [
                <InfoCircleFilled key="InfoCircleFilled" onClick={() => { message.success("InfoCircle") }} />,
                <QuestionCircleFilled key="QuestionCircleFilled" onClick={() => { message.success("QuestionCircle") }} />,
                <GithubFilled key="GithubFilled" onClick={() => { message.success("Github") }} />,
            ];
        }
    };
};