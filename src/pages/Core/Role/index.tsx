import RemoteSelect, { OptionItem } from '@/components/Select/RemoteSelect';
import { useRef } from 'react';

const TableList: React.FC<unknown> = () => {

  const childRef = useRef<OptionItem>(null);

  return (
    <>
      <RemoteSelect
        defaultValue={null}
        options={[
          {
            label: "请选择",
            value: null
          }
        ]}
        ref={childRef}
        remote={{
          url: '/api/dorpDown/roles',
          pageSize: 10,
          responseInterceptors: (e: any) => {
            e.data.data = e.data.data.map((m: { label: any; }) => {
              return {
                ...m,
                label1: m.label,
              }
            });
            return e;
          }
        }}
        onSelect={(e) => {
          console.log(e);

          const item = childRef.current?.data?.find((f: any) => f.value === e);
          console.log(item);
        }}
      ></RemoteSelect>
      <label> {new Date().format('yyyy-MM-dd')}</label>
    </>
  );
};

export default TableList;
