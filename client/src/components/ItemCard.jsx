import { Link } from 'react-router-dom';
import { MapPin, CalendarDays, ArrowUpRight } from 'lucide-react';
export default function ItemCard({ item }) {
 const isLost = item.type === 'lost';
 return <article className="item-card"><div className={`item-visual ${isLost ? 'lost-visual' : 'found-visual'}`}>{item.imageUrl ? <img src={item.imageUrl} alt={item.title}/> : <span>{item.category === 'Electronics' ? '⌁' : item.category === 'Keys' ? '⚿' : item.category === 'Bags' ? '▱' : '✳'}</span>}<span className={`type-badge ${isLost ? 'lost' : 'found'}`}>{isLost ? 'Lost item' : 'Found item'}</span></div><div className="item-card-body"><div className="card-title-row"><span className="category-label">{item.category}</span><span className="status-dot">{item.status}</span></div><h3>{item.title}</h3><p className="item-description">{item.description}</p><div className="item-meta"><span><MapPin size={14}/>{item.location}</span><span><CalendarDays size={14}/>{new Date(item.date).toLocaleDateString()}</span></div><Link className="card-link" to={`/items/${item._id}`}>View details <ArrowUpRight size={16}/></Link></div></article>;
}
