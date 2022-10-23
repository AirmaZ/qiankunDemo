import logo from './logo.svg';
import LoadMicroMedBill from "./Component/LoadMicroMedBill";
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <LoadMicroMedBill
          id={'app1'}
          props={{
            route: 'medBillDemo1',
            idSrv: 'idSrv:12321314232',
            idMedord: 'idSrv:123123232131'
          }}
        />
        <br/>
        <LoadMicroMedBill
          id={'app2'}
          props={{
            route: 'medBillDemo1',
            idSrv: 'idSrv:12322323131',
            idMedord: 'idSrv:123123232131'
          }}
        />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
