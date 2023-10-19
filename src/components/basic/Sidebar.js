import React from 'react';
import '../../styles/Sidebar.css'

const Sidebar = () => (
  <aside className="Sidebar">
    <h3>Sidebar Title</h3>
    <ul>
      <li><a href="#related-link1">Related Link 1</a></li>
      <li><a href="#related-link2">Related Link 2</a></li>
      <li><a href="#related-link3">Related Link 3</a></li>
      {/* You can add more related links or other sidebar content as needed */}
    </ul>
    <div className="sidebar-ads">
      <p>Advertisement Here</p>
      {/* You can place ad scripts or other ad-related content here */}
    </div>
  </aside>
);

export default Sidebar;
