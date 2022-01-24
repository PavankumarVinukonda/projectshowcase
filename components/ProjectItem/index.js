import './index.css'

const ProjectItem = props => {
  const {data} = props
  const {id, imageUrl, name} = data
  return (
    <li key={id} className="list-element">
      <img src={imageUrl} alt={name} className="project-image" />
      <p className="name">{name}</p>
    </li>
  )
}

export default ProjectItem
