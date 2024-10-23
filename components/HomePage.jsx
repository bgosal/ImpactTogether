import { Item } from "@components/Item"

export const HomePage = () => {
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
          <Item />
        </div>
      </section>
    </main>
  )
}

