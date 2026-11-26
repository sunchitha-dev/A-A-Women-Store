import ContactHero from '../components/contact/ContactHero'
import GreetingsMarquee from '../components/contact/GreetingsMarquee'
import ContactCards from '../components/contact/ContactCards'
import MessageForm from '../components/contact/MessageForm'
import SwipeLooks from '../components/contact/SwipeLooks'
import QuickAnswers from '../components/contact/QuickAnswers'
import ContactCTA from '../components/contact/ContactCTA'

export default function Contact() {
  return (
    <>
      <ContactHero />
      <GreetingsMarquee />
      <ContactCards />
      <MessageForm />
      <SwipeLooks />
      <QuickAnswers />
      <ContactCTA />
    </>
  )
}
