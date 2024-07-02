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
    <div style={{ maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}>Visualizador de Acordes de Violão</h1>
      <div style={{ marginBottom: '20px' }}>{renderFretboard()}</div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Lado esquerdo - Grupos de acordes */}
        <div style={{ width: '48%' }}>
          {Object.entries(chordGroups).map(([groupName, groupChords]) => (
            <div key={groupName} style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>{groupName}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {groupChords.map(chord => (
                  <label key={chord} style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="radio"
                      checked={selectedChord === chord}
                      onChange={() => setSelectedChord(chord)}
                      style={{ marginRight: '5px' }}
                    />
                    {chord}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Linha divisória central */}
        <div style={{ width: '1px', backgroundColor: '#ccc', margin: '0 20px' }}></div>

        {/* Lado direito - Acorde selecionado e botão de tocar */}
        <div style={{ width: '48%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Acorde Selecionado</h2>
          <p style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>{selectedChord}</p>
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>{chordNames[selectedChord]}</p>
          <button 
            onClick={playChord}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Tocar Acorde
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuitarChordVisualizer;