export default function Saved() {
  return (
    <main>
      <section className="item-container">
        <div className="filter-section">
          <input type="text" placeholder="Search..." className="filter-input"/>
          <select className="filter-dropdown">
            <option value="">Select City</option>
            <option value="langley">Langley</option>
            <option value="vancouver">Vancouver</option>
            <option value="abbotsford">Abbotsford</option>
            <option value="surrey">Surrey</option>
          </select>
          <select className="filter-dropdown">
            <option value="">Select Category</option>
            <option value="health">Health</option>
            <option value="food">Food</option>
            <option value="community">Community</option>
          </select>
          <button className="filter-button">Apply Filters</button>
        </div>

        <div className="item-list">
          <div className="item">
            {/* <img src="https://via.placeholder.com/100" alt="Item Image" className="item-image"> */}
            <div className="item-description">
              <h3>Item 1</h3>
              <p>This is a short description of item 1. It is designed to give a brief overview.</p>
            </div>
            <div className="item-buttons">
              <button className="item-button">Cancel</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
