import React from 'react'
import CustomerHeader from '../../../components/CustomerHeader'
import YourOrdersCard from '../../../components/YourOrdersCard'
import useAuth from '../../../hooks/use-auth'
import useOrders from '../../../hooks/use-order'
import { useNavigate } from 'react-router-dom'
const YourOrders = () => {
  const navigate = useNavigate();
  const {loggedInUser} = useAuth()

  const {orders} = useOrders({customerId:loggedInUser?._id, shouldFetchCustomerOrders:true})



  // const orders = [
  //   {
  //     "_id": "698a1d28f5afb6e9e399fdfc",
  //     "restaurantName": "etc 2",
  //     "orderType": "dining",
  //     "arrivalTime": "2026-02-13T19:47:00Z",
  //     "items": [
  //       {
  //         "_id": "69870eceb04e50f0e56d616f",
  //         "name": "Club Sandwhich",
  //         "description": "Delicious club sandwich with fresh ingredients",
  //         "price": 670,
  //         "quantity": 1,
  //         "image": {
  //           "url": "https://res.cloudinary.com/dqoyfmgky/image/upload/v1770458830/restaurants/banners/x2qrffv2gwzi5lqyhei7.jpg"
  //         }
  //       }
  //     ],
  //     "total": 703.5,
  //     "totalItems": 1,
  //     "createdAt": "2026-02-09T17:45:12.307Z",
  //     "status": "pending" // Add status field for tracking
  //   }
  //   ,
  //   {
  //     "_id": "698a1d28f5afb6e9e399fdfc",
  //     "restaurantName": "etc 2",
  //     "orderType": "dining",
  //     "arrivalTime": "2026-02-13T19:47:00Z",
  //     "items": [
  //       {
  //         "_id": "69870eceb04e50f0e56d616f",
  //         "name": "Club Sandwhich",
  //         "description": "Delicious club sandwich with fresh ingredients",
  //         "price": 670,
  //         "quantity": 1,
  //         "image": {
  //           "url": "https://res.cloudinary.com/dqoyfmgky/image/upload/v1770458830/restaurants/banners/x2qrffv2gwzi5lqyhei7.jpg"
  //         }
  //       }
  //     ],
  //     "total": 703.5,
  //     "totalItems": 1,
  //     "createdAt": "2026-02-09T17:45:12.307Z",
  //     "status": "pending" // Add status field for tracking
  //   }
  // ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <CustomerHeader/>
      
      <div className='container pt-[50px] pb-[80px] px-4 md:px-6'>
        {/* Header Section */}
        <div className='mb-8'>
          <h2 className='font-hegarty text-3xl md:text-5xl text-[#3a3a3a] mb-2'>
            Your Orders
          </h2>
          <p className='text-gray-600 text-sm md:text-base'>
            Track and manage all your orders in one place
          </p>
        </div>

        {/* Orders Grid */}
        {orders.length > 0 ? (
          <div className='grid lg:grid-cols-2 grid-cols-1 gap-6'>
            {orders.map((order) => (
              <YourOrdersCard key={order._id} order={order} onClick={() => navigate(`/track-order/${order._id}`)}/>
            ))}
          </div>
        ) : (
          <div className='text-center py-20'>
            <div className='text-6xl mb-4'>🍽️</div>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>No orders yet</h3>
            <p className='text-gray-500'>Your order history will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default YourOrders