import React from 'react'

const Dashmain = () => {
  return (
    <div>
      <h3 className='text-3xl font-light'>Dashboard</h3>
      <div className='grid mt-5 grid-cols-2 gap-5'>
        <div className="bg-white rounded-[20px] p-6 items-center flex justify-between">
        <p className='text-2x'>
            Active Orders
        </p>
        <p className='text-4xl' >
            12
        </p>

        </div>
          <div className="bg-white rounded-[20px] p-6 items-center flex justify-between">
        <p className='text-2x'>
            In Kitchen
        </p>
        <p className='text-4xl' >
            4
        </p>
        

        </div>
          <div className="bg-white rounded-[20px] p-6 items-center flex justify-between">
        <p className='text-2x'>
            Out for Delivery
        </p>
        <p className='text-4xl' >
            4
        </p>
        

        </div>
        <div></div>
      </div>
    </div>
  )
}

export default Dashmain
