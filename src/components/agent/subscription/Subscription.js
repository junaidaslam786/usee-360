import React from 'react'
import PaidServices from '../payments/paid-services'

const Subscription = () => {
  return (
    <div> 
      <PaidServices servicesType="paid" />
      <PaidServices servicesType="free" />
    </div>
  )
}

export default Subscription