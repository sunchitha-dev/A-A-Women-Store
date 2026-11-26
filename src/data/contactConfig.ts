import { aboutConfig } from './aboutConfig'

export const contactConfig = {
  whatsapp: '917904733345',
  phoneDisplay: '+91 79047 33345',
  phoneTel: '+917904733345',
  instagram: 'aandawomenstore',
  address: aboutConfig.address,
  hours: aboutConfig.hours,
  payments: aboutConfig.payments,
  delivery: aboutConfig.delivery,
  topics: ['Order', 'Korean stock', 'Tailoring', 'Delivery', 'Visit the store', 'Other'],
  greetings: ['HELLO', 'HI', 'VANAKKAM', 'ANNYEONG', 'NAMASTE'],
  faqs: [
    { q: 'Do you deliver?', a: aboutConfig.delivery },
    { q: 'Can I order on WhatsApp?', a: 'Yes. Message us on WhatsApp or Instagram DM.' },
    { q: 'What payments do you accept?', a: aboutConfig.payments.join(', ') },
    { q: 'Do you do custom tailoring?', a: 'Yes.', link: '/tailoring' },
  ],
}
