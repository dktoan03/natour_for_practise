import { showAlert } from './alerts'

export const bookTour = async tourId => {
  const stripe = Stripe(
    'pk_test_51P6HM5KRI5zKbpaz9irXT7cw3f3y2i6SQSRpQvsxmPr10rxhHOHuyXAvSgcCqC4vqPNK3o5HJMUdYxXFajuDqvZm00bNgzXZPj'
  )
  try {
    const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`)
    console.log(session)

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    })
  } catch (err) {
    console.log(err)
    showAlert('error', err)
  }
}
