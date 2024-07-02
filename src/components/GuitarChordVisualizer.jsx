import React, { useState, useCallback } from 'react';

const chords = {
  'C': [
    { string: 5, fret: 3 },
    { string: 4, fret: 2 },
    { string: 2, fret: 1 },
  ],
  'G': [
    { string: 6, fret: 3 },
    { string: 5, fret: 2 },
    { string: 1, fret: 3 },
  ],
  'D': [
    { string: 3, fret: 2 },
    { string: 2, fret: 3 },
    { string: 1, fret: 2 },
  ],
  'A': [
    { string: 4, fret: 2 },
    { string: 3, fret: 2 },
    { string: 2, fret: 2 },
  ],
  'E': [
    { string: 5, fret: 2 },
    { string: 4, fret: 2 },
    { string: 3, fret: 1 },
  ],
  'Am': [
    { string: 4, fret: 2 },
    { string: 3, fret: 2 },
    { string: 2, fret: 1 },
  ],
  'F': [
    { string: 6, fret: 1, barre: true },
    { string: 5, fret: 3 },
    { string: 4, fret: 3 },
    { string: 3, fret: 2 },
  ],
  'B7': [
    { string: 5, fret: 2 },
    { string: 4, fret: 1 },
    { string: 3, fret: 2 },
    { string: 1, fret: 2 },
  ],
  'Dm': [
    { string: 4, fret: 0 },
    { string: 3, fret: 2 },
    { string: 2, fret: 3 },
    { string: 1, fret: 1 },
  ],
  'Bm': [
    { string: 6, fret: 2, barre: true },
    { string: 4, fret: 4 },
    { string: 3, fret: 4 },
    { string: 2, fret: 3 },
  ],
  'C7': [
    { string: 5, fret: 3 },
    { string: 4, fret: 2 },
    { string: 2, fret: 1 },
    { string: 1, fret: 0 },
  ],
  'Em': [
    { string: 5, fret: 2 },
    { string: 4, fret: 2 },
  ],
  'G7': [
    { string: 6, fret: 3 },
    { string: 5, fret: 2 },
    { string: 4, fret: 0 },
    { string: 3, fret: 0 },
    { string: 2, fret: 0 },
    { string: 1, fret: 1 },
  ],
  'A7': [
    { string: 4, fret: 2 },
    { string: 3, fret: 0 },
    { string: 2, fret: 2 },
  ],
  'D7': [
    { string: 4, fret: 0 },
    { string: 3, fret: 2 },
    { string: 2, fret: 1 },
    { string: 1, fret: 2 },
  ],
};

const chordGroups = {
  'Maiores': ['C', 'G', 'D', 'A', 'E', 'F'],
  'Menores': ['Am', 'Dm', 'Em', 'Bm'],
  'Com Sétima': ['B7', 'C7', 'G7', 'A7', 'D7'],
};

const chordNames = {
  'C': 'Dó Maior',
  'G': 'Sol Maior',
  'D': 'Ré Maior',
  'A': 'Lá Maior',
  'E': 'Mi Maior',
  'Am': 'Lá Menor',
  'F': 'Fá Maior',
  'B7': 'Si com Sétima',
  'Dm': 'Ré Menor',
  'Bm': 'Si Menor',
  'C7': 'Dó com Sétima',
  'Em': 'Mi Menor',
  'G7': 'Sol com Sétima',
  'A7': 'Lá com Sétima',
  'D7': 'Ré com Sétima',
};

const GuitarChordVisualizer = () => {
  const [selectedChord, setSelectedChord] = useState('C');

  const playChord = useCallback(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    
    const frequencies = {
      'C': 261.63, 'D': 293.66, 'E': 329.63, 'F': 349.23,
      'G': 392.00, 'A': 440.00, 'B': 493.88
    };

    const baseNote = selectedChord[0];
    const isMinor = selectedChord.includes('m');
    const isSeventh = selectedChord.includes('7');

    const playNote = (freq) => {
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(freq, now);

      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(now);
      oscillator.stop(now + 1);
    };

    playNote(frequencies[baseNote]);
    const third = isMinor ? frequencies[baseNote] * 1.189207115 : frequencies[baseNote] * 1.259921049;
    playNote(third);
    playNote(frequencies[baseNote] * 1.498307077);

    if (isSeventh) {
      const seventh = frequencies[baseNote] * 1.781797436;
      playNote(seventh);
    }
  }, [selectedChord]);

  const renderFretboard = () => {
    const fretboard = [];
    const fingerPositions = chords[selectedChord].sort((a, b) => a.fret - b.fret);
    const barrePosition = fingerPositions.find(pos => pos.barre);
    
    for (let string = 6; string >= 1; string--) {
      const stringFrets = [];
      for (let fret = 9; fret >= 0; fret--) {
        const playedNote = fingerPositions.find(
          note => note.string === string && note.fret === fret
        );
        const fingerNumber = playedNote ? fingerPositions.indexOf(playedNote) + 1 : null;
        const isBarre = barrePosition && fret === barrePosition.fret && string >= barrePosition.string;
        
        stringFrets.push(
          <div 
            key={`${string}-${fret}`} 
            style={{
              width: fret === 0 ? '40px' : '128px',
              height: '32px',
              borderRight: '1px solid #888',
              borderBottom: '1px solid #888',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {fret > 0 && (
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: '#888',
                top: '50%',
              }}></div>
            )}
            {fingerNumber && fret > 0 && !isBarre && (
              <div style={{
                position: 'absolute',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'blue',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
              }}>
                {fingerNumber}
              </div>
            )}
            {fret === 0 && (playedNote?.fret === 0 ? 'O' : (playedNote || isBarre ? '' : 'X'))}
            {[3, 5, 7, 9].includes(fret) && (
              <div style={{
                position: 'absolute',
                bottom: '2px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#888',
              }}></div>
            )}
          </div>
        );
      }
      fretboard.push(
        <div key={string} style={{ display: 'flex', position: 'relative' }}>
          {stringFrets}
          {barrePosition && string >= barrePosition.string && string === 6 && (
            <div style={{
              position: 'absolute',
              top: '50%',
              right: `${(9 - barrePosition.fret) * 128 + 40}px`,
              left: '0px',
              height: '4px',
              backgroundColor: 'black',
              transform: 'translateY(-50%)',
              zIndex: 20,
            }}></div>
          )}
          <div style={{
            width: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
          }}>{string}</div>
        </div>
      );
    }
    return fretboard;
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Visualizador de Acordes de Violão</h1>
      <div className="mb-4 border-t border-l border-gray-300 overflow-x-auto">
        {renderFretboard()}
      </div>
      <div className="flex">
        <div className="w-1/2 pr-4">
          {Object.entries(chordGroups).map(([groupName, groupChords]) => (
            <div key={groupName} className="mb-4">
              <h2 className="text-xl font-semibold mb-2">{groupName}</h2>
              <div className="flex flex-wrap">
                {groupChords.map(chord => (
                  <label key={chord} className="inline-flex items-center mr-4 mb-2">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-blue-600"
                      checked={selectedChord === chord}
                      onChange={() => setSelectedChord(chord)}
                    />
                    <span className="ml-2 text-lg">{chord}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="w-px bg-gray-300 mx-4"></div>
        <div className="w-1/2 pl-4 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Acorde Selecionado</h2>
            <p className="text-4xl font-semibold">{selectedChord}</p>
            <p className="text-xl mt-2">{chordNames[selectedChord]}</p>
            <button 
              onClick={playChord}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Tocar Acorde
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuitarChordVisualizer;