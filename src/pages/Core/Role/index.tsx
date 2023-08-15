import RemoteSelect, { RemoteOption } from '@/components/Select';
import { useRef } from 'react';

const TableList: React.FC<unknown> = () => {

  const childRef = useRef<RemoteOption>(null);

  return (
    <RemoteSelect
      // mode='multiple'
      ref={childRef}
      remote={{
        url: '/api/dorpDown/roles',
        immediately: false,
      }}
      onSelect={(e) => {
        const item = childRef.current?.options?.find((f: any) => f.value === e);
        console.log(item);
      }}
    ></RemoteSelect>
  );
};

export default TableList;