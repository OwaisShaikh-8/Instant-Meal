import React from 'react'
import CustomerHeader from '../../../components/CustomerHeader';

const TrackOrder = () => {
  return (
    <>
    <CustomerHeader/>
    <div className='pt-[200px] pb-[100px] container'>
      <h2 className='font-hegarty text-2xl md:text-4xl  text-[#3a3a3a]'>Order ID : 12345678</h2>
         <ul className='flex gap-[150px] mt-[50px] justify-center text-lg text-[#888585] font-[700]'>
                <li className='text-[blue]'>Order Placed</li>
                <li className='text-[blue]'>Order Accepted </li>
                <li>In Kitchen</li>
                <li>Ready</li>
                <li>Handed Over to Delivery Partner</li>
            </ul>
        <div className='flex mt-[50px] gap-[50px]'>
            <div className="w-[400px] h-[400px] rounded-lg overflow-hidden flex-shrink-0">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
          alt="Food"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Content */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">
          Chicken Burger Combo
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Juicy chicken burger with fries and cold drink
        </p>

        <p className="text-sm font-medium text-gray-700 mt-2">
          Quantity: <span className="font-semibold">2</span>
        </p>
      </div>

     
        </div>
           
    </div>
    </>
  )
}

export default TrackOrder;
