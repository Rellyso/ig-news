import { render, screen } from '@testing-library/react'
import { stripe } from '../../services/stripe'
import Home, { getStaticProps } from '../../pages'
import { mocked } from 'jest-mock'

jest.mock('next/router')
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false]
  }
})

jest.mock('../../services/stripe')

describe('Home page', () => {
  it('renders correctly', () => {
    render(<Home product={{ priceId: 'fake-price-id', amount: 'R$ 10,00' }} />)

    expect(screen.getByText('for R$ 10,00 month')).toBeInTheDocument();
  })

  it('loads initial data', async () => {
    const retrieveStripeMocked = mocked(stripe.prices.retrieve)

    retrieveStripeMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any)

    const response = await getStaticProps({})

    // console.log(response)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: 'R$\xa010,00'
          },
        }
      })
    )
  })
})