import { mount } from 'nsh'
import { BotApp } from '../BotApp'

// Exercise the real screen and Connection; only filesystem discovery is replaced.
mount(() => <BotApp discover={async () => 'http://127.0.0.1:12345/login'} />)
