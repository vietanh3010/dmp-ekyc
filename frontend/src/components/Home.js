import React, { Component } from 'react'

import { LeftMenu} from '../components'

class HomeComponent extends Component {
  render() {
    return (
      <div className="container py-5">
        <div className="row">
          <div className="col-3">
            <LeftMenu />
          </div>
          <div className="col-9">
            <div className="card rounded-0 w-100">
              <div className="card-body">
                Welcome Home!
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
};

export default HomeComponent;
