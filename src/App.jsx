import { useState, useRef, useEffect } from "react";
import audioFile from "/beep.mp3"; // Ruta al archivo de sonido

export function App() {
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [isWorking, setIsWorking] = useState(true);
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [disableButtons, setDisableButtons] = useState(false);
  const [key, setKey] = useState(0); // Nuevo estado para forzar la actualización del efecto
  const timerRef = useRef(null);
  const audioElementRef = useRef(null);

  useEffect(() => {
    setTimeLeft(isWorking ? workTime * 60 : breakTime * 60);
  }, [workTime, breakTime, isWorking]);

  useEffect(() => {
    if (isRunning) {
      // Si el temporizador está en funcionamiento, se debe actualizar el tiempo restante cada segundo
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timerRef.current);
            audioElementRef.current.play();
            setIsWorking((prevIsWorking) => !prevIsWorking);
            setKey((prevKey) => prevKey + 1); // Cambiar la clave para forzar la actualización del efecto
            return isWorking ? breakTime * 60 : workTime * 60;
          }
          return prevTime - 1;
        });
      }, 1000);
      setDisableButtons(true);
    } else {
      clearInterval(timerRef.current);
      setDisableButtons(false);
    }
    return () => clearInterval(timerRef.current); // Limpiar el intervalo cuando el componente se desmonte
  }, [isRunning, isWorking, workTime, breakTime, key]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsWorking(true);
    setTimeLeft(workTime * 60);
    setKey((prevKey) => prevKey + 1); // Forzar la actualización del efecto
  };

  const handleWorkIncrease = () => {
    if (!isRunning) {
      setWorkTime((prevTime) => prevTime + 1);
    }
  };

  const handleWorkDecrease = () => {
    if (!isRunning && workTime > 1) {
      setWorkTime((prevTime) => prevTime - 1);
    }
  };

  const handleBreakIncrease = () => {
    if (!isRunning) {
      setBreakTime((prevTime) => prevTime + 1);
    }
  };

  const handleBreakDecrease = () => {
    if (!isRunning && breakTime > 1) {
      setBreakTime((prevTime) => prevTime - 1);
    }
  };

  return (
    <main className="shadow rounded bg-black bg-opacity-10 h-50 justify-content-evenly position-absolute top-50 start-50 translate-middle d-flex flex-column mb-3 w-50">
      <h1 className="text-center text-white ">Pomodoro</h1>
      <section className="container d-flex align-items-center flex flex-column mb-3">
        <div className="timer">
          <h3 className="text-secondary text-center">
            {isWorking ? "Work!" : "Break!"}
          </h3>
          <h2 className="fw-semi-bold text-white opacity-75">
            {`${Math.floor(timeLeft / 60)
              .toString()
              .padStart(2, "0")}:${(timeLeft % 60)
              .toString()
              .padStart(2, "0")}`}
          </h2>
        </div>
        <div className="container controller d-flex justify-content-around">
          <div className="w-25">
            <h4 className="text-center text-secondary">Work</h4>
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-primary btn-sm"
                disabled={disableButtons}
                onClick={handleWorkDecrease}
              >
                <span className="fw-bold fs-5 text-dark">-</span>
              </button>
              <span className="text-primary fw-bold fs-4">{workTime}</span>
              <button
                className="btn btn-primary btn-sm"
                disabled={disableButtons}
                onClick={handleWorkIncrease}
              >
                <span className="fw-bold fs-5 text-dark">+</span>
              </button>
            </div>
          </div>
          <div className="w-25">
            <h4 className="text-center text-secondary">Break</h4>
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-primary btn-sm"
                disabled={disableButtons}
                onClick={handleBreakDecrease}
              >
                <span className="fw-bold fs-5 text-dark">-</span>
              </button>
              <span className="text-primary fw-bold fs-4">{breakTime}</span>
              <button
                className="btn btn-primary btn-sm"
                disabled={disableButtons}
                onClick={handleBreakIncrease}
              >
                <span className="fw-bold fs-5 text-dark">+</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className="d-flex mx-auto p-2 justify-content-evenly w-50">
        {isRunning ? (
          <button className="btn btn-outline-primary" onClick={pauseTimer}>
            Pause
          </button>
        ) : (
          <button className="btn btn-primary" onClick={startTimer}>
            Start
          </button>
        )}
        <button className="btn btn-warning" onClick={resetTimer}>
          Reset
        </button>
      </div>
      <audio src={audioFile} ref={audioElementRef} />
    </main>
  );
}
