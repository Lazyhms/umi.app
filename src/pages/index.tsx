import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';
import { Divider } from 'antd';
import { Timer } from '@/components/Timer';

const HomePage: React.FC = () => {

  const o: any[] = [
    { name: "111", code: "222" },
    { name: "111" },
    { name: "222" }
  ];

  const b: any[] = [
    { name: "111" },
    { name: "333" },
  ];

  const name: string | null = "2";

  const f = () => {

    let formdata = new FormData();
    formdata.append("name", "2222");
    formdata.append("file", new Blob())
    formdata.append("sex", "2222");
    return formdata;
  }

  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Timer format={'yyyy年MM月dd日 HH时mm分ss秒'}></Timer>
        <Divider type="horizontal" />
        {name}
        <Divider type="horizontal" />
        {name.isNullOrEmpty().toString()}
        <Divider type="horizontal" />
        {"name".isNullOrWhiteSpace().toString()}
        <Divider type="horizontal" />
        {JSON.stringify(f().toJson())}
        <Divider type="horizontal" />
        <label>O {JSON.stringify(o)}</label>
        <Divider type="horizontal" />
        <label>B {JSON.stringify(b)}</label>
        <Divider type="horizontal" />
        <label>O 去重：{JSON.stringify(o.distinctBy(d => d.name))}</label>
        <Divider type="horizontal" />
        <label>O B 差集：{JSON.stringify(o.exceptBy(b, p => p.name))}</label>
        <Divider type="horizontal" />
        <label>O B 交集: {JSON.stringify(o.intersectBy(b, p => p.name))}</label>
      </div>
    </PageContainer>
  );
};

export default HomePage;