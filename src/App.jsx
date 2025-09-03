import { useState, useEffect } from 'react'
import { RESIDENTS, BILL_TYPES, HOUSE_PERIOD } from './config'
import { calculateResidentDays, getDaysDifference, generateCSV, downloadCSV } from './utils'
import './App.css'

function App() {
  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem('houseBills')
    return saved ? JSON.parse(saved) : []
  })
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    localStorage.setItem('houseBills', JSON.stringify(bills))
  }, [bills])

  const addBill = (type, amount, description) => {
    const newBill = {
      id: Date.now(),
      type,
      amount: parseFloat(amount),
      description,
      dateAdded: new Date().toISOString()
    }
    setBills([...bills, newBill])
    setShowAddForm(false)
  }

  const removeBill = (id) => {
    setBills(bills.filter(bill => bill.id !== id))
  }

  const getTotalsByType = () => {
    const totals = {}
    BILL_TYPES.forEach(type => {
      totals[type] = bills
        .filter(bill => bill.type === type)
        .reduce((sum, bill) => sum + bill.amount, 0)
    })
    return totals
  }

  const calculateIndividualAmounts = () => {
    const residentDays = calculateResidentDays(RESIDENTS, HOUSE_PERIOD)
    const totalsByType = getTotalsByType()
    
    const results = {}
    
    Object.keys(RESIDENTS).forEach(name => {
      const days = residentDays[name]
      
      results[name] = {
        total: 0,
        days: days,
        billTypes: {}
      }
    })

    BILL_TYPES.forEach(type => {
      const typeTotal = totalsByType[type]
      const peopleWithDays = Object.keys(RESIDENTS).filter(name => residentDays[name] > 0)
      const totalPersonDays = peopleWithDays.reduce((sum, name) => sum + residentDays[name], 0)
      
      Object.keys(RESIDENTS).forEach(name => {
        const days = residentDays[name]
        const amount = days > 0 ? (typeTotal * days) / totalPersonDays : 0
        
        results[name].billTypes[type] = {
          total: amount,
          proportion: days > 0 ? days / totalPersonDays : 0
        }
        results[name].total += amount
      })
    })

    Object.keys(RESIDENTS).forEach(name => {
      const days = residentDays[name]
      const totalHouseDays = getDaysDifference(HOUSE_PERIOD.start, HOUSE_PERIOD.end)
      results[name].proportion = days / totalHouseDays
    })

    return results
  }

  const handleDownloadCSV = () => {
    const individualAmounts = calculateIndividualAmounts()
    const totalsByType = getTotalsByType()
    const csvContent = generateCSV(totalsByType, individualAmounts)
    downloadCSV(csvContent)
  }

  const totalsByType = getTotalsByType()
  const individualAmounts = calculateIndividualAmounts()
  const grandTotal = Object.values(totalsByType).reduce((sum, amount) => sum + amount, 0)

  return (
    <div className="app">
      <h1>🏠 Gestor de Facturas de Casa</h1>
      
      <div className="section">
        <h2>📊 Resumen</h2>
        <div className="totals-grid">
          {BILL_TYPES.map(type => (
            <div key={type} className="total-card">
              <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
              <p>€{totalsByType[type].toFixed(2)}</p>
            </div>
          ))}
          <div className="total-card grand-total">
            <h3>Total General</h3>
            <p>€{grandTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>📋 Facturas ({bills.length})</h2>
          <button onClick={() => setShowAddForm(true)} className="btn-primary">
            + Añadir Factura
          </button>
        </div>
        
        {showAddForm && (
          <AddBillForm 
            onAdd={addBill} 
            onCancel={() => setShowAddForm(false)} 
          />
        )}

        <div className="bills-list">
          {bills.map(bill => (
            <div key={bill.id} className="bill-item">
              <div>
                <strong>{bill.type}</strong> - €{bill.amount}
                {bill.description && <div className="description">{bill.description}</div>}
              </div>
              <button onClick={() => removeBill(bill.id)} className="btn-danger">
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>💰 Cuánto Debe Pagar Cada Persona</h2>
          <button onClick={handleDownloadCSV} className="btn-secondary" disabled={bills.length === 0}>
            📊 Descargar CSV
          </button>
        </div>
        
        <div className="results-grid">
          {Object.entries(individualAmounts).map(([person, data]) => (
            <div key={person} className="person-card">
              <h3>{person}</h3>
              <div className="total">€{data.total.toFixed(2)}</div>
              <div className="details">
                {data.days} días ({(data.proportion * 100).toFixed(1)}%)
              </div>
              <div className="breakdown">
                {BILL_TYPES.map(type => (
                  <div key={type} className="breakdown-item">
                    {type}: €{data.billTypes[type].total.toFixed(2)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AddBillForm({ onAdd, onCancel }) {
  const [type, setType] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!type || !amount) return
    onAdd(type, amount, description)
    setType('')
    setAmount('')
    setDescription('')
  }

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <div className="form-row">
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="">Selecciona tipo...</option>
          {BILL_TYPES.map(billType => (
            <option key={billType} value={billType}>
              {billType.charAt(0).toUpperCase() + billType.slice(1)}
            </option>
          ))}
        </select>
        
        <input
          type="number"
          step="0.01"
          placeholder="Cantidad (€)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        
        <input
          type="text"
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        
        <button type="submit" className="btn-primary">Añadir</button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
      </div>
    </form>
  )
}

export default App