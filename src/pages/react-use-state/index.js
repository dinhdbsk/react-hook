import React, {useState} from "react";

export default function ReactUseState() {
  const [count, setCount] = useState(5);
  const [name, setName] = useState({firstName: 'dinh', lastName: 'pv'});
  const [items, setItems] = useState([]);

  return (
    <div>
      <h1>useState</h1>
      <div>{count}</div>
      <br/>
      <button onClick={() => setCount(count + 1)}>Set count</button>
      <br/>
      <br/>
      <button onClick={() => setCount(prevState => prevState + 1)}>Set count via previous state</button>
      <hr/>
      <div>firstName</div>
      <input type="text" value={name.firstName} onChange={e => setName({...name, firstName: e.target.value})}/>
      <div>lastName</div>
      <input type="text" value={name.lastName} onChange={e => setName({...name, lastName: e.target.value})}/>
      <div>
        {JSON.stringify(name)}
      </div>
      <hr/>
      <div>
        <button onClick={() => setItems([...items, {id: Math.ceil(Math.floor(Math.random() * 100))}])}>add item</button>
        <br/>
        <br/>
        <div>List item</div>
        <ul style={{width: 100, margin: 'auto'}}>
          {items.map((item, index) => (
            <li key={index}>{item.id}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
