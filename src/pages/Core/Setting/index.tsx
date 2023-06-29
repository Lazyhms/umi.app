import { PageContainer } from "@ant-design/pro-components";
import { Tabs } from "antd";
import { useRef, useState } from "react";

const defaultPanes =
    [...[{
        label: `默认分组`,
        children: `Content of Tab Pane 0`,
        key: '0',
        closable: false
    }], ...new Array(2).fill(null).map((_, index) => {
        const id = String(index + 1);
        return {
            label: `Tab ${id}`,
            children: `Content of Tab Pane ${index + 1}`,
            key: id
        };
    })];

const Setting: React.FC<unknown> = () => {
    const [targetKey, setTargetKey] = useState('-1');
    const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
    const [items, setItems] = useState(defaultPanes);
    const newTabIndex = useRef(0);

    const onChange = (key: string) => {
        setActiveKey(key);
    };

    const add = () => {
        const newActiveKey = `newTab${newTabIndex.current++}`;
        setItems([...items, { label: 'New Tab', children: 'New Tab Pane', key: newActiveKey }]);
        setActiveKey(newActiveKey);
    };

    const remove = (targetKey: any) => {
        const targetIndex = items.findIndex((pane) => pane.key === targetKey);
        const newPanes = items.filter((pane) => pane.key !== targetKey);
        if (newPanes.length && targetKey === activeKey) {
            const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
            setActiveKey(key);
        }
        setItems(newPanes);
    };

    const onEdit = (targetKey: any, action: 'add' | 'remove') => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };

    type TargetKey = React.MouseEvent | React.KeyboardEvent;

    return (
        <PageContainer header={{
            title: '',
            subTitle: ''
        }}>
            <Tabs
                onChange={onChange}
                activeKey={activeKey}
                type="editable-card"
                onEdit={onEdit}
                items={items}
                onDoubleClick={(e: TargetKey) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                }}
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();

                    const targetElementRole = (e.target as HTMLDivElement).attributes.getNamedItem("role")?.value;
                    if (targetElementRole !== 'tab') {
                        return;
                    }

                    const targetValue = (e.target as HTMLDivElement).parentElement?.attributes.getNamedItem('data-node-key')?.value ?? '-1';
                    setTargetKey(targetValue);
                }}
                onMouseMove={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                }}
                onMouseUp={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                    
                    if ('-1' === targetKey) {
                        return;
                    }

                    const targetElementRole = (e.target as HTMLDivElement).attributes.getNamedItem("role")?.value;
                    if (targetElementRole !== 'tab') {
                        return;
                    }

                    const currentKey = (e.target as HTMLDivElement).parentElement?.attributes.getNamedItem('data-node-key')?.value;
                    if (targetKey === currentKey) {
                        return;
                    }

                    const index = items.findIndex(f => f.key === targetKey);
                    const item = items.find(f => f.key === targetKey);
                    const index1 = items.findIndex(f => f.key === currentKey);
                    const item1 = items.find(f => f.key === currentKey);
                    items.splice(index, 1, item1!);
                    items.splice(index1, 1, item!);

                    setItems([...items]);
                    setActiveKey(activeKey)
                }}
            />
        </PageContainer>
    );
}

export default Setting;