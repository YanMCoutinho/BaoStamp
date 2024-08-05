import React, { useEffect, useState } from 'react';
import { fetchGraphQLData } from '../utils/graphql';
import { VoucherType } from '../utils/types';
import { VOUCHERS_QUERY } from '../utils/queries';

const Voucher = ({input_index}: {input_index: number}) => {
  const [vouchers, setVouchers] = useState<VoucherType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await fetchGraphQLData<{ vouchers: { edges: { node: VoucherType }[] } }>(VOUCHERS_QUERY(input_index));
        setVouchers(data.vouchers.edges.map((edge: any) => edge.node));
      } catch (err) {
        setError('Error fetching vouchers.');
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-6">Vouchers</h2>
      <table className="min-w-full divide-y divide-gray-200 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Index</th>
            <th className="px-4 py-2">Input Index</th>
            <th className="px-4 py-2">Destination</th>
            <th className="px-4 py-2">Payload</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher, idx) => (
            <tr key={idx} className="hover:bg-purple-700 transition-colors duration-300">
              <td className="px-4 py-2">{voucher.index}</td>
              <td className="px-4 py-2">{voucher.input.index}</td>
              <td className="px-4 py-2">{voucher.destination}</td>
              <td className="px-4 py-2">{voucher.payload}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Voucher;