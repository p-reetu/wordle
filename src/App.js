import "./App.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Word from "./components/word";
import { useEffect, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import Button from "react-bootstrap/Button";
import axios from "axios";

function App() {
  const [word, setWord] = useState("");
  useEffect(() => {
    axios
      .get("https://random-word-api.herokuapp.com/word?length=5")
      .then((response) => {
        console.log(response.data[0]);
        setWord(response.data[0]);
        // Example output: "mango"
      })
      .catch((error) => {
        console.error("Error fetching word:", error);
      });
  }, []);
  async function isValidWord(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Word not found");
    }

    const data = await response.json();
    return true; // Word exists
  } catch (error) {
    return false; // Word not found
  }
  }
  var arr = [
    ["-", "-", "-", "-", "-"],
    ["-", "-", "-", "-", "-"],
    ["-", "-", "-", "-", "-"],
    ["-", "-", "-", "-", "-"],
    ["-", "-", "-", "-", "-"],
    ["-", "-", "-", "-", "-"],
  ];
  const [mat, setMat] = useState(arr);
  const [currRow, setCurrRow] = useState(0);
  const [currCol, setCurrRCol] = useState(0);
  const [colorMat, setColorMat] = useState(arr);
  const [usedkeys, setUsedkeys] = useState("null");
  const [correctusedkeys, setcorrectusedkeys] = useState(["null"]);
  const [partialcorrectusedkeys, setPartialcorrectusedkeys] = useState(["null"]);
  const [finalMessage, setFinalMessage] = useState("  ");
  const [isWordValid, setIsWordValid] = useState(false);
  useEffect(() => {
    async function checkWord() {
      const word = mat[currRow].join("");
      const valid = await isValidWord(word);
      setIsWordValid(valid);
    }
  
    checkWord();
  }, [currRow, mat]);

  const handleKeyPress = (button) => {
    //console.log("Key Pressed:", button);
    if (button === "{bksp}") {
      if (currCol === 0) {
        return;
      }
      // Update the matrix with the updated input
      const newMat = [...mat];
      newMat[currRow][currCol - 1] = "-";
      setMat(newMat);
      setCurrRCol(currCol - 1);
      return;
    } else if (currCol < 5) {
      const newMat = [...mat];
      newMat[currRow][currCol] = button;
      //console.log(newMat);
      setMat(newMat);
      //console.log(mat);
      //setCurrRow(currRow+1);
      setCurrRCol(currCol + 1);
      //console.log(currCol);
    }
  };
  const customLayout = {
    default: [
      "q w e r t y u i o p",
      "a s d f g h j k l",
      "z x c v b n m {bksp}",
    ],
  };
  function handleSubmit() {
    arr = ["-", "-", "-", "-", "-"];
    if (word === mat[currRow].join("")) {
      setFinalMessage("Congratulations!! The word was "+word);
      window.setTimeout(()=>{
        window.location.reload();
      },3000)
    }

    for (var i = 0; i < 5; i++) {
      if (mat[currRow][i] === word[i]) {
        arr[i] = "bg-success";
        setcorrectusedkeys([...correctusedkeys, ...mat[currRow].filter((ch, i) => ch === word[i])]);
      } else if (word.includes(mat[currRow][i])) {
        arr[i] = "bg-warning";
        if (!correctusedkeys || !correctusedkeys.includes(mat[currRow][i])){
          console.log(mat[currRow][i]);
          setPartialcorrectusedkeys([...partialcorrectusedkeys, mat[currRow][i]]);
          console.log(partialcorrectusedkeys);
        }
      } else {
        arr[i] = "bg-secondary";
      }
    }
    setUsedkeys(usedkeys + " " + mat[currRow].join(" "));
    const newMat = [...colorMat];
    newMat[currRow] = arr;
    setColorMat(newMat);
    console.log(currRow);
    setCurrRow(prev => prev + 1);
    console.log(currRow);
    setCurrRCol(0);
    console.log(currRow);
    if (currRow === 5 && word !== mat[currRow].join("")) {
      setFinalMessage("Oh No!! The word was "+word);
      window.setTimeout(()=>{
        window.location.reload();
      },3000);
    }
  }

  var buttonTheme = [
    {
      class: "my-special-key", // Custom class for specific keys
      buttons: usedkeys, // These keys will have the class
    },
    {
      class: "correct-key", // Custom class for specific keys
      buttons: correctusedkeys.join(" "), // These keys will have the class
    },
    {
      class: "partial-correct-key", // Custom class for specific keys
      buttons: partialcorrectusedkeys.join(" "), // These keys will have the class
    },
  ];
  return (
    <>
    <br></br>
      <h4 className="text-center">My Wordle</h4>
      <br></br>
      <Container>
        {mat.map((row, index) => (
          <Word row={row} bgcolorrow={colorMat[index]} />
        ))}
      </Container>
      <br></br>
      <br></br>
      <Container>
        <Row>
          <Col>
            <Keyboard
              layout={customLayout}
              onKeyPress={handleKeyPress}
              buttonTheme={buttonTheme}
            />
          </Col>
        </Row>
        <br></br>
        <Row>
          <Col className="mx-auto">
            <div className="d-grid gap-2">
              <Button
                id="submit-btn"
                onClick={handleSubmit}
                disabled={currCol < 5 || !isWordValid}
              >
                Submit
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
          {!isWordValid && currCol === 5 && <p className="text-center">Not a dictionary word!</p>}
          </Col>
        </Row>
        <br></br>
        <Row>
          <Col className="text-center">
          <h4><i>{finalMessage}</i></h4>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
