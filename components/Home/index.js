import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import ProjectItem from '../ProjectItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    activeCatagory: 'ALL',
    catagoryList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    const {activeCatagory} = this.state
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const url = `https://apis.ccbp.in/ps/projects?category=${activeCatagory}`

    const response = await fetch(url)
    if (response.ok) {
      const resposeData = await response.json()
      const modifiedData = resposeData.projects.map(item => ({
        id: item.id,
        imageUrl: item.image_url,
        name: item.name,
      }))

      this.setState({
        catagoryList: modifiedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeSelect = event => {
    this.setState(
      {
        activeCatagory: event.target.value,
      },
      this.getData,
    )
  }

  renderSelectContainer = () => {
    const {categoriesList} = this.props
    const {activeCatagory} = this.state
    return (
      <div className="select-container">
        <select
          className="select-element"
          value={activeCatagory}
          onChange={this.onChangeSelect}
        >
          {categoriesList.map(item => (
            <option value={item.id}>{item.displayText}</option>
          ))}
        </select>
      </div>
    )
  }

  renderItemContainer = () => {
    const {catagoryList} = this.state

    return (
      <ul className="ul-element">
        {catagoryList.map(item => (
          <ProjectItem key={item.id} data={item} />
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" height="50px" width="50px" />
    </div>
  )

  renderAll = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderItemContainer()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  retryClick = () => {
    this.getData()
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.retryClick}>
        Retry
      </button>
    </div>
  )

  render() {
    return (
      <div className="bg-container">
        <Header />
        {this.renderSelectContainer()}
        {this.renderAll()}
      </div>
    )
  }
}

export default Home
