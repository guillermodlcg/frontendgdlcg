import React from "react";
import { IoPersonOutline } from 'react-icons/io5';
import { FaRegAddressCard } from 'react-icons/fa';
import { MdPhoneIphone } from 'react-icons/md';

function ShippingInfo({name, address, phone}) {

  return (
    <div className="space-y-4 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-md text-gray-950 dark:text-gray-100 text-sm">
      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="flex items-center font-semibold text-gray-700 dark:text-gray-300">
          <IoPersonOutline size={20} className="mr-2 text-blue-600 dark:text-blue-400" /> Nombre:
        </span>
        <span className="font-medium">{name}</span>
      </div>
      <div className="flex justify-between items-start py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="flex items-center font-semibold text-gray-700 dark:text-gray-300">
          <FaRegAddressCard size={20} className="mr-2 text-green-600 dark:text-green-400" /> Dirección:
        </span>
        <p className="font-medium text-right max-w-xs">{address}</p>
      </div>
      <div className="flex justify-between items-center py-2">
        <span className="flex items-center font-semibold text-gray-700 dark:text-gray-300">
          <MdPhoneIphone size={20} className="mr-2 text-purple-600 dark:text-purple-400" /> Teléfono:
        </span>
        <span className="font-medium">{phone}</span>
      </div>
    </div>
  );
}

export default ShippingInfo;
