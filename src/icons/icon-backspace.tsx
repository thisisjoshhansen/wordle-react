// https://fonts.google.com/icons?selected=Material+Symbols+Outlined:backspace:FILL@0;wght@400;GRAD@0;opsz@24&icon.query=delete&icon.size=24&icon.color=%235f6368

export default function IconBackspace({
  title='Backspace',
  scale=1,
}:{
  title?: string,
  scale?: number,
}={}) {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="1em"
    width="1em"
    style={{fontSize:`${scale}em`}}
    viewBox="0 -960 960 960"
    fill="currentColor"
  >
    { title && <title>{ title }</title> }
    <path d="m456-320 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 160q-19 0-36-8.5T296-192L80-480l216-288q11-15 28-23.5t36-8.5h440q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H360ZM180-480l180 240h440v-480H360L180-480Zm400 0Z"/>
  </svg>;
}
