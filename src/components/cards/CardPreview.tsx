import { BankCard } from '@/types';
import { RevolutLogo } from '@/components/ui/RevolutLogo';
import { Snowflake } from '@/components/ui/OfficialIcons';
import { OfficialIcon } from '@/components/ui/ReferenceIcons';

export function CardPreview({card,details=false}:{card:BankCard;details?:boolean}) {
  return <span className={`reference-card-preview card-theme-${card.theme} ${card.isFrozen?'card-frozen':''}`}>{details&&<><span className="card-wordmark">Revolut</span><span className="card-virtual">VIRTUAL</span><span className="card-number">···· {card.last4}</span></>}<RevolutLogo className="card-r" variant={card.name.includes('Lavender')?'black':'white'}/>{card.theme==='blood_drip'&&<svg viewBox="0 0 180 110" className="card-drips"><defs><linearGradient id={`drip-${card.id}`} x2="1" y2="1"><stop stopColor="#120002"/><stop offset=".45" stopColor="#7a0010"/><stop offset=".6" stopColor="#ea5366"/><stop offset=".8" stopColor="#240003"/></linearGradient></defs><path d="M0 0h180v36c-14-24-17-15-19 19s-13 39-17 7-13-45-19-24-7 68-17 63-2-36-8-67-14-29-19-8-8 63-18 41-3-49-16-45-2 40-16 35-2-35-15-31L0 29Z" fill={`url(#drip-${card.id})`}/></svg>}<span className="card-scheme"><OfficialIcon name={card.scheme==='visa'?'logo-visa':'logo-mc'}/></span>{card.isFrozen&&<span className="card-freeze"><Snowflake/></span>}</span>;
}
