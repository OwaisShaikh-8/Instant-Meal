import React from 'react'
import CustomerHeader from '../../../components/CustomerHeader'
import YourOrdersCard from '../../../components/YourOrdersCard'

const YourOrders = () => {
  return (
    <div>
      <CustomerHeader/>
      <div className='container pt-[200px]'>
       <h2 className='font-hegarty text-2xl md:text-4xl  text-[#3a3a3a]'>
            Your Orders
        </h2>
        <div className='py-[50px] grid md:grid-cols-2 grid-cols-1 gap-[10px]'>
        <YourOrdersCard/>
        <YourOrdersCard/>
        <YourOrdersCard/>
        <YourOrdersCard/>
        <YourOrdersCard/>

        </div>
      </div>
    </div>
  )
}

export default YourOrders
