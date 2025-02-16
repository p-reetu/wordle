import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState, useEffect } from 'react';

export default function Word(props) {
  const [r, setR] = useState(props.row);
/*
  // Use useEffect to update state when props.row changes
  useEffect(() => {
    if (props.row.length < 5) {
      setR(...props.row + ("-".repeat(5 - props.row.length)).split("")); // Correct string concatenation
    } else {
      setR(props.row);
    }
  }, [props.row]); // This effect will run whenever props.row changes
*/
const [bg,setBg] = useState("");
/*
if(props.bgcolor==0){
  setBg("");
}
else if (props.bgcolor==1){
  setBg("bg-warning");
}
else{
  setBg("bg-success");
}*/
  return (
    <Row>
      {r.map((c, index) => (
        <Col key={index} id="letter" className={props.bgcolorrow[index]}>
          {c}
        </Col>
      ))}
    </Row>
  );
}
