import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { FiCheck } from 'react-icons/fi';
import { orderApi } from '../api/orderApi';
import Loader from '../components/Loader';

const OrderSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderApi.getOrderById(orderId),
    enabled: !!orderId,
  });

  if (isLoading) {
    return <div className="py-20"><Loader /></div>;
  }

  const displayOrderId = order?.orderNumber || orderId || 'N/A';
  const paymentMethod = order?.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment';

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-8 animate-float-up">
      {/* Animated Success Icon Circle */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg relative">
        <span className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-35"></span>
        <FiCheck className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-850 m-0 leading-tight">
          {t('orderSuccessTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
          {t('orderSuccessMsg')}
        </p>
      </div>

      {/* Order Info Card */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs divide-y divide-stone-100">
        <div className="pb-3 flex justify-between text-xs sm:text-sm font-semibold">
          <span className="text-stone-400">{t('orderId')}</span>
          <span className="text-primary font-mono font-bold">{displayOrderId}</span>
        </div>
        <div className="pt-3 flex justify-between text-xs sm:text-sm font-semibold">
          <span className="text-stone-400">Payment Method</span>
          <span className="text-emerald-600 uppercase">{paymentMethod}</span>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex flex-col gap-3 pt-4">
        <button
          onClick={() => navigate('/')}
          className="bg-primary hover:bg-primary-light text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-98 focus:outline-hidden"
        >
          {t('continueShopping')}
        </button>
        
        <button
          onClick={() => navigate('/profile')}
          className="border-2 border-stone-250 hover:bg-stone-50 text-stone-600 hover:text-stone-800 font-semibold py-3 rounded-xl transition-all"
        >
          View Order History
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
