import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';
import { useState } from 'react';
import { Divider } from 'antd';

const HomePage: React.FC = () => {
  const [date] = useState(new Date().format("yyyy-MM-dd HH:mm:ss"));

  const o: any[] = [
    { name: "111" },
    { name: "111" },
    { name: "222" }
  ];

  const b: any[] = [
    { name: "111" },
    { name: "333" },
  ];

  const name: string | null = "           ";

  return (
    <PageContainer ghost>
      <div className={styles.container}>
        {name.isNullOrWhiteSpace().toString()}
        <Divider type="horizontal" />
        {"name".isNullOrWhiteSpace().toString()}
        <Divider type="horizontal" />
        {date}
        <Divider type="horizontal" />
        {[1, 1, 2, 3, 4, 5].distinct().toString()}
        <Divider type="horizontal" />
        <label>去重：{JSON.stringify(o.distinctBy(d => d.name))}</label>
        <Divider type="horizontal" />
        <label>差集：{JSON.stringify([1, 3, 4].except([3, 4, 5]))}</label>
        <Divider type="horizontal" />
        <label>差集：{JSON.stringify(o.exceptBy(b, p => p.name))}</label>
        <Divider type="horizontal" />
        <label>交集：{JSON.stringify([1, 3, 4].intersect([3, 4, 5]))}</label>
        <Divider type="horizontal" />
        <label>交集：{JSON.stringify(o.intersectBy(b, p => p.name))}</label>
      </div>
    </PageContainer>
  );
};

export default HomePage;