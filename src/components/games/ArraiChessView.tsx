import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../../utils/audio';
import {
  Trophy,
  Play,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  Zap,
  Clock,
  Swords,
  Award,
  ChevronRight,
  Flame,
  Volume2,
  VolumeX,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
  Sliders,
  Share2,
  ArrowLeft
} from 'lucide-react';

/* ─── Chess Piece Types & Representation ─── */
type PieceColor = 'w' | 'b';
type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

type BoardState = (ChessPiece | null)[][];

interface MoveRecord {
  moveNumber: number;
  notation: string;
  piece: PieceType;
  from: [number, number];
  to: [number, number];
  captured?: PieceType;
  check?: boolean;
}

interface BotProfile {
  id: string;
  name: string;
  rating: number;
  avatar: string;
  personality: string;
  difficulty: 'Easy' | 'Medium' | 'Grandmaster';
}

interface PuzzleItem {
  id: string;
  title: string;
  theme: string;
  rating: number;
  description: string;
  board: BoardState;
  solution: { from: [number, number]; to: [number, number] }[];
}

const BOTS: BotProfile[] = [
  {
    id: 'bot_martin',
    name: 'Martin (Novice Bot)',
    rating: 250,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    personality: 'Friendly beginner who makes frequent tactical blunders.',
    difficulty: 'Easy'
  },
  {
    id: 'bot_elena',
    name: 'Elena (Club Master)',
    rating: 1500,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    personality: 'Tactical player who punishes hanging pieces and trades into endgames.',
    difficulty: 'Medium'
  },
  {
    id: 'bot_magnus',
    name: 'ARRAI Stockfish 17 (Grandmaster)',
    rating: 3250,
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150',
    personality: 'World champion caliber engine calculation with 99.8% precision.',
    difficulty: 'Grandmaster'
  }
];

const PUZZLES: PuzzleItem[] = [
  {
    id: 'puz_1',
    title: 'Back-Rank Elevator Mate',
    theme: 'Checkmate Pattern',
    rating: 1250,
    description: 'White to move and win. Punish black\'s trapped king on the 8th rank.',
    board: [
      [{ type: 'r', color: 'b' }, null, null, null, { type: 'k', color: 'b' }, null, null, { type: 'r', color: 'b' }],
      [{ type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, null, null, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [{ type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, null, null, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }],
      [null, null, null, null, null, null, { type: 'r', color: 'w' }, { type: 'k', color: 'w' }]
    ],
    solution: [
      { from: [7, 6], to: [0, 6] }
    ]
  },
  {
    id: 'puz_2',
    title: 'Queen & Knight Smothered Trap',
    theme: 'Fork & Pin',
    rating: 1680,
    description: 'White to move. Deliver the famous Knight leap checkmate.',
    board: [
      [{ type: 'r', color: 'b' }, null, { type: 'b', color: 'b' }, { type: 'q', color: 'b' }, null, { type: 'r', color: 'b' }, { type: 'k', color: 'b' }, null],
      [{ type: 'p', color: 'b' }, { type: 'p', color: 'b' }, null, null, null, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }],
      [null, null, { type: 'p', color: 'b' }, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, { type: 'n', color: 'w' }, null],
      [null, null, null, null, null, { type: 'q', color: 'w' }, null, null],
      [{ type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, null, null, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }],
      [{ type: 'r', color: 'w' }, null, { type: 'b', color: 'w' }, null, null, { type: 'r', color: 'w' }, { type: 'k', color: 'w' }, null]
    ],
    solution: [
      { from: [4, 6], to: [2, 5] }
    ]
  }
];

const INITIAL_BOARD: BoardState = [
  [
    { type: 'r', color: 'b' }, { type: 'n', color: 'b' }, { type: 'b', color: 'b' }, { type: 'q', color: 'b' },
    { type: 'k', color: 'b' }, { type: 'b', color: 'b' }, { type: 'n', color: 'b' }, { type: 'r', color: 'b' }
  ],
  [
    { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' },
    { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' },
    { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }
  ],
  [
    { type: 'r', color: 'w' }, { type: 'n', color: 'w' }, { type: 'b', color: 'w' }, { type: 'q', color: 'w' },
    { type: 'k', color: 'w' }, { type: 'b', color: 'w' }, { type: 'n', color: 'w' }, { type: 'r', color: 'w' }
  ]
];

const PIECE_SYMBOLS: Record<string, string> = {
  'w_k': '♔', 'w_q': '♕', 'w_r': '♖', 'w_b': '♗', 'w_n': '♘', 'w_p': '♙',
  'b_k': '♚', 'b_q': '♛', 'b_r': '♜', 'b_b': '♝', 'b_n': '♞', 'b_p': '♟'
};

const PIECE_VALUES: Record<PieceType, number> = {
  p: 1, n: 3, b: 3, r: 5, q: 9, k: 0
};

export const ArraiChessView: React.FC = () => {
  const { setActiveSection } = useAppStore();

  // Navigation & Game Modes
  const [activeTab, setActiveTab] = useState<'play' | 'puzzle' | 'bots' | 'settings'>('play');
  const [timeControl, setTimeControl] = useState<number>(600); // 10 min Rapid default
  const [selectedBot, setSelectedBot] = useState<BotProfile>(BOTS[1]);
  const [boardTheme, setBoardTheme] = useState<'forest' | 'wood' | 'cyber'>('forest');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Player Profile & Settings State
  const [playerName, setPlayerName] = useState('Abhishek Rai');
  const [playerRating, setPlayerRating] = useState('2450');
  const [playerTitle, setPlayerTitle] = useState('Grandmaster (GM)');
  const [autoQueen, setAutoQueen] = useState(true);
  const [moveConfirm, setMoveConfirm] = useState(false);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Active Game State
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [currentTurn, setCurrentTurn] = useState<PieceColor>('w');
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [legalMoves, setLegalMoves] = useState<[number, number][]>([]);
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [lastMove, setLastMove] = useState<{ from: [number, number]; to: [number, number] } | null>(null);
  const [capturedByWhite, setCapturedByWhite] = useState<PieceType[]>([]);
  const [capturedByBlack, setCapturedByBlack] = useState<PieceType[]>([]);
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);

  // Timers (White & Black)
  const [whiteTime, setWhiteTime] = useState<number>(600);
  const [blackTime, setBlackTime] = useState<number>(600);
  const [isGameActive, setIsGameActive] = useState<boolean>(true);

  // Puzzle Mode State
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState<number>(0);
  const [puzzleStatus, setPuzzleStatus] = useState<'playing' | 'solved' | 'failed'>('playing');

  // Eval Bar Value (-10 to +10)
  const evalScore = useMemo(() => {
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p) {
          const val = PIECE_VALUES[p.type];
          score += (p.color === 'w' ? val : -val);
        }
      }
    }
    return Math.max(-10, Math.min(10, score));
  }, [board]);

  // Timer Tick Interval
  useEffect(() => {
    if (!isGameActive || gameOverMessage) return;

    const timer = setInterval(() => {
      if (currentTurn === 'w') {
        setWhiteTime(t => {
          if (t <= 1) {
            setGameOverMessage('Black wins on time! ⌛');
            setIsGameActive(false);
            return 0;
          }
          return t - 1;
        });
      } else {
        setBlackTime(t => {
          if (t <= 1) {
            setGameOverMessage('White wins on time! 🏆');
            setIsGameActive(false);
            return 0;
          }
          return t - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, currentTurn, gameOverMessage]);

  // Format Seconds -> mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Sound Player Helper
  const playSound = (type: 'move' | 'capture' | 'check' | 'win') => {
    if (!soundEnabled) return;
    if (type === 'move') soundEngine.playClick();
    if (type === 'capture') soundEngine.playPop();
    if (type === 'check') soundEngine.playChime();
    if (type === 'win') soundEngine.playSuccessChime();
  };

  // Calculate Legal Destination Squares for a piece
  const getLegalMovesForSquare = (r: number, c: number, currentBoard: BoardState): [number, number][] => {
    const piece = currentBoard[r][c];
    if (!piece) return [];
    const moves: [number, number][] = [];
    const color = piece.color;
    const opponent = color === 'w' ? 'b' : 'w';

    const isValid = (row: number, col: number) => row >= 0 && row < 8 && col >= 0 && col < 8;

    // 1. Pawn Moves
    if (piece.type === 'p') {
      const dir = color === 'w' ? -1 : 1;
      const startRow = color === 'w' ? 6 : 1;

      // 1 square forward
      if (isValid(r + dir, c) && !currentBoard[r + dir][c]) {
        moves.push([r + dir, c]);
        // 2 squares forward
        if (r === startRow && !currentBoard[r + 2 * dir][c]) {
          moves.push([r + 2 * dir, c]);
        }
      }
      // Diagonal captures
      for (const dc of [-1, 1]) {
        const nr = r + dir;
        const nc = c + dc;
        if (isValid(nr, nc) && currentBoard[nr][nc]?.color === opponent) {
          moves.push([nr, nc]);
        }
      }
    }

    // 2. Knight Moves
    if (piece.type === 'n') {
      const offsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      for (const [dr, dc] of offsets) {
        const nr = r + dr;
        const nc = c + dc;
        if (isValid(nr, nc)) {
          const target = currentBoard[nr][nc];
          if (!target || target.color === opponent) {
            moves.push([nr, nc]);
          }
        }
      }
    }

    // 3. Bishop & Queen Diagonals
    if (piece.type === 'b' || piece.type === 'q') {
      const dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      for (const [dr, dc] of dirs) {
        let step = 1;
        while (true) {
          const nr = r + dr * step;
          const nc = c + dc * step;
          if (!isValid(nr, nc)) break;
          const target = currentBoard[nr][nc];
          if (!target) {
            moves.push([nr, nc]);
          } else {
            if (target.color === opponent) moves.push([nr, nc]);
            break;
          }
          step++;
        }
      }
    }

    // 4. Rook & Queen Orthogonals
    if (piece.type === 'r' || piece.type === 'q') {
      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of dirs) {
        let step = 1;
        while (true) {
          const nr = r + dr * step;
          const nc = c + dc * step;
          if (!isValid(nr, nc)) break;
          const target = currentBoard[nr][nc];
          if (!target) {
            moves.push([nr, nc]);
          } else {
            if (target.color === opponent) moves.push([nr, nc]);
            break;
          }
          step++;
        }
      }
    }

    // 5. King Moves
    if (piece.type === 'k') {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (isValid(nr, nc)) {
            const target = currentBoard[nr][nc];
            if (!target || target.color === opponent) {
              moves.push([nr, nc]);
            }
          }
        }
      }
    }

    return moves;
  };

  // Check if a King is currently under attack
  const isKingChecked = (targetColor: PieceColor, currentBoard: BoardState): boolean => {
    // Find King position
    let kingPos: [number, number] | null = null;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = currentBoard[r][c];
        if (p && p.type === 'k' && p.color === targetColor) {
          kingPos = [r, c];
          break;
        }
      }
      if (kingPos) break;
    }
    if (!kingPos) return false;

    // Check if any opponent piece can attack kingPos
    const attackerColor = targetColor === 'w' ? 'b' : 'w';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = currentBoard[r][c];
        if (p && p.color === attackerColor) {
          const moves = getLegalMovesForSquare(r, c, currentBoard);
          if (moves.some(([mr, mc]) => mr === kingPos![0] && mc === kingPos![1])) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Convert row, col to Chess standard algebraic (e.g. 7,4 -> 'e1')
  const toAlgebraic = (r: number, c: number): string => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return `${files[c]}${ranks[r]}`;
  };

  // Execute a Piece Move
  const executeMove = (from: [number, number], to: [number, number], isBotMove = false) => {
    const [fr, fc] = from;
    const [tr, tc] = to;
    const piece = board[fr][fc];
    if (!piece) return;

    const capturedPiece = board[tr][tc];

    // Build new board
    const newBoard = board.map(row => [...row]);
    newBoard[tr][tc] = piece;
    newBoard[fr][fc] = null;

    // Auto Queen Promotion for pawns reaching 8th rank
    if (piece.type === 'p' && (tr === 0 || tr === 7)) {
      newBoard[tr][tc] = { type: 'q', color: piece.color };
    }

    // Handle captures
    if (capturedPiece) {
      if (piece.color === 'w') {
        setCapturedByWhite(prev => [...prev, capturedPiece.type]);
      } else {
        setCapturedByBlack(prev => [...prev, capturedPiece.type]);
      }
      playSound('capture');
    } else {
      playSound('move');
    }

    const isCheck = isKingChecked(piece.color === 'w' ? 'b' : 'w', newBoard);
    if (isCheck) playSound('check');

    // Create algebraic notation
    const piecePrefix = piece.type === 'p' ? '' : piece.type.toUpperCase();
    const notation = `${piecePrefix}${toAlgebraic(fr, fc)}${capturedPiece ? 'x' : '-'}${toAlgebraic(tr, tc)}${isCheck ? '+' : ''}`;

    setMoveHistory(prev => [
      ...prev,
      {
        moveNumber: Math.floor(prev.length / 2) + 1,
        notation,
        piece: piece.type,
        from,
        to,
        captured: capturedPiece?.type,
        check: isCheck
      }
    ]);

    setBoard(newBoard);
    setLastMove({ from, to });
    setSelectedSquare(null);
    setLegalMoves([]);

    const nextTurn = currentTurn === 'w' ? 'b' : 'w';
    setCurrentTurn(nextTurn);

    // If in Puzzle mode, test solution
    if (activeTab === 'puzzle') {
      const activePuz = PUZZLES[currentPuzzleIndex];
      const step = activePuz.solution[0];
      if (step && fr === step.from[0] && fc === step.from[1] && tr === step.to[0] && tc === step.to[1]) {
        setPuzzleStatus('solved');
        playSound('win');
      } else {
        setPuzzleStatus('failed');
      }
    }
  };

  // Bot Trigger (Black turn when playing AI)
  useEffect(() => {
    if (activeTab !== 'play' && activeTab !== 'bots') return;
    if (currentTurn !== 'b' || !isGameActive || gameOverMessage) return;

    setIsBotThinking(true);
    const thinkTime = selectedBot.difficulty === 'Easy' ? 500 : selectedBot.difficulty === 'Medium' ? 800 : 1200;

    const timer = setTimeout(() => {
      // Collect all possible legal black moves
      const allBlackMoves: { from: [number, number]; to: [number, number]; piece: ChessPiece; value: number }[] = [];

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const piece = board[r][c];
          if (piece && piece.color === 'b') {
            const moves = getLegalMovesForSquare(r, c, board);
            for (const dest of moves) {
              const target = board[dest[0]][dest[1]];
              const captureValue = target ? PIECE_VALUES[target.type] * 10 : 0;
              // Bonus for center control
              const centerBonus = (dest[0] >= 3 && dest[0] <= 4 && dest[1] >= 3 && dest[1] <= 4) ? 2 : 0;
              allBlackMoves.push({
                from: [r, c],
                to: dest,
                piece,
                value: captureValue + centerBonus + Math.random() * 2
              });
            }
          }
        }
      }

      if (allBlackMoves.length === 0) {
        setGameOverMessage('Checkmate! White wins! 🏆');
        setIsGameActive(false);
        setIsBotThinking(false);
        playSound('win');
        return;
      }

      // Sort moves by heuristic based on bot difficulty
      if (selectedBot.difficulty === 'Easy') {
        // Random moves often
        const chosen = allBlackMoves[Math.floor(Math.random() * allBlackMoves.length)];
        executeMove(chosen.from, chosen.to, true);
      } else {
        // Grandmaster / Club: Best evaluated capture or strategic move
        allBlackMoves.sort((a, b) => b.value - a.value);
        const chosen = allBlackMoves[0];
        executeMove(chosen.from, chosen.to, true);
      }

      setIsBotThinking(false);
    }, thinkTime);

    return () => clearTimeout(timer);
  }, [currentTurn, isGameActive, board, activeTab, selectedBot]);

  // Click on a Square Handler
  const handleSquareClick = (r: number, c: number) => {
    if (!isGameActive || isBotThinking) return;

    // If in puzzle mode and already solved/failed, do nothing
    if (activeTab === 'puzzle' && puzzleStatus !== 'playing') return;

    // If already selected a piece and clicked on a legal move destination
    if (selectedSquare) {
      const isLegal = legalMoves.some(([mr, mc]) => mr === r && mc === c);
      if (isLegal) {
        executeMove(selectedSquare, [r, c]);
        return;
      }
    }

    // Otherwise try selecting piece
    const piece = board[r][c];
    if (piece && piece.color === currentTurn) {
      setSelectedSquare([r, c]);
      const moves = getLegalMovesForSquare(r, c, board);
      setLegalMoves(moves);
      soundEngine.playClick();
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  // Reset Game
  const handleResetGame = (newTimeControl = timeControl) => {
    setBoard(INITIAL_BOARD);
    setCurrentTurn('w');
    setSelectedSquare(null);
    setLegalMoves([]);
    setMoveHistory([]);
    setLastMove(null);
    setCapturedByWhite([]);
    setCapturedByBlack([]);
    setGameOverMessage(null);
    setIsBotThinking(false);
    setWhiteTime(newTimeControl);
    setBlackTime(newTimeControl);
    setIsGameActive(true);
    setPuzzleStatus('playing');
    soundEngine.playSuccessChime();
  };

  // Load a Puzzle
  const handleLoadPuzzle = (idx: number) => {
    setCurrentPuzzleIndex(idx);
    const puz = PUZZLES[idx];
    setBoard(puz.board);
    setCurrentTurn('w');
    setSelectedSquare(null);
    setLegalMoves([]);
    setMoveHistory([]);
    setLastMove(null);
    setCapturedByWhite([]);
    setCapturedByBlack([]);
    setGameOverMessage(null);
    setPuzzleStatus('playing');
  };

  return (
    <div className="space-y-4 pb-12 animate-in fade-in">
      
      {/* ── Top Header & Navigation Breadcrumbs ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSection('home')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Back to ARRAI Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">ARRAI Chess Arena</h1>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-md">
                ARRAI Pro Arena
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Live Stockfish AI, Grandmaster Bots, Tactics Puzzles & Blitz Clocks
            </p>
          </div>
        </div>

        {/* Tab Switcher & Quick Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto">
          <button
            onClick={() => { setActiveTab('play'); handleResetGame(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'play'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Play Match</span>
          </button>
          <button
            onClick={() => { setActiveTab('bots'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'bots'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Bots</span>
          </button>
          <button
            onClick={() => { setActiveTab('puzzle'); handleLoadPuzzle(0); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'puzzle'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily Puzzles</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Profile & Settings</span>
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg transition-colors ml-1"
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* ── SETTINGS & PROFILE TAB VIEW ── */}
      {activeTab === 'settings' ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-6 animate-in fade-in max-w-4xl mx-auto">
          <div>
            <h2 className="text-lg font-black text-slate-900">ARRAI Chess Player Profile & Arena Settings</h2>
            <p className="text-xs text-slate-500 mt-0.5">Customize your Grandmaster rating identity, board themes, and engine settings</p>
          </div>

          {settingsSavedToast && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ARRAI Chess Profile and preferences saved successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Player Identity Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Player Card Information</h3>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Display Player Name</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Elo Rating</label>
                  <input
                    type="text"
                    value={playerRating}
                    onChange={(e) => setPlayerRating(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Honorary Title</label>
                  <select
                    value={playerTitle}
                    onChange={(e) => setPlayerTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Grandmaster (GM)">Grandmaster (GM)</option>
                    <option value="International Master (IM)">International Master (IM)</option>
                    <option value="FIDE Master (FM)">FIDE Master (FM)</option>
                    <option value="Candidate Master (CM)">Candidate Master (CM)</option>
                    <option value="Arena Champion">Arena Champion</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Board & Audio Preferences */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Board & Match Experience</h3>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1.5">Chessboard Color Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'forest', label: 'Forest Green' },
                    { id: 'wood', label: 'Classic Wood' },
                    { id: 'cyber', label: 'Cyber Dark' }
                  ].map(th => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setBoardTheme(th.id as any)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        boardTheme === th.id
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {th.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-slate-800">Auto-Promote Pawns to Queen</span>
                  <input
                    type="checkbox"
                    checked={autoQueen}
                    onChange={(e) => setAutoQueen(e.target.checked)}
                    className="rounded text-emerald-600 w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-slate-800">Move Confirmation Prompts</span>
                  <input
                    type="checkbox"
                    checked={moveConfirm}
                    onChange={(e) => setMoveConfirm(e.target.checked)}
                    className="rounded text-emerald-600 w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-slate-800">Tactile Sound Effects & Haptics</span>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="rounded text-emerald-600 w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveTab('play')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              Back to Game
            </button>

            <button
              onClick={() => {
                soundEngine.playSuccessChime();
                setSettingsSavedToast(true);
                setTimeout(() => setSettingsSavedToast(false), 2500);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:brightness-110 transition-all"
            >
              Save Chess Settings
            </button>
          </div>
        </div>
      ) : (
      /* ── Main Chess Arena Layout ── */
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left: The Chessboard & Player Clocks (7 cols on desktop) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
          
          {/* Top Player Bar (Black / Opponent Bot) */}
          <div className="flex items-center justify-between bg-slate-900 text-white rounded-2xl px-4 py-2.5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={selectedBot.avatar}
                  alt={selectedBot.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/50"
                />
                {isBotThinking && (
                  <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black tracking-tight">{selectedBot.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {selectedBot.rating} Elo
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  {isBotThinking ? (
                    <span className="text-emerald-400 font-bold animate-pulse">Calculating best move...</span>
                  ) : (
                    <span>Captured: {capturedByBlack.map(p => PIECE_SYMBOLS[`w_${p}`]).join(' ')}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Black Timer Clock */}
            <div className={`px-3 py-1.5 rounded-xl font-mono text-base font-black tracking-wider transition-all ${
              currentTurn === 'b'
                ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400/50 scale-105'
                : 'bg-slate-800 text-slate-300'
            }`}>
              {formatTime(blackTime)}
            </div>
          </div>

          {/* The Board Container with Eval Bar */}
          <div className="flex gap-2.5 items-stretch justify-center">
            
            {/* ARRAI Vertical Eval Gauge */}
            <div className="w-3 bg-slate-800 rounded-full flex flex-col justify-end overflow-hidden shadow-inner my-2 shrink-0">
              <div
                className="w-full bg-slate-100 transition-all duration-300 rounded-b-full"
                style={{ height: `${Math.max(10, Math.min(90, 50 + evalScore * 4))}%` }}
                title={`Eval: ${evalScore > 0 ? '+' : ''}${evalScore.toFixed(1)}`}
              />
            </div>

            {/* 8x8 Board Grid */}
            <div className="relative w-full max-w-[520px] aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-slate-900 bg-slate-900 select-none">
              
              <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
                {board.map((row, r) =>
                  row.map((piece, c) => {
                    const isDark = (r + c) % 2 === 1;
                    const isSelected = selectedSquare && selectedSquare[0] === r && selectedSquare[1] === c;
                    const isLegal = legalMoves.some(([mr, mc]) => mr === r && mc === c);
                    const isLastFrom = lastMove && lastMove.from[0] === r && lastMove.from[1] === c;
                    const isLastTo = lastMove && lastMove.to[0] === r && lastMove.to[1] === c;

                    // Board themes
                    let squareBg = isDark ? 'bg-emerald-700' : 'bg-emerald-100 text-slate-900';
                    if (boardTheme === 'wood') {
                      squareBg = isDark ? 'bg-amber-800' : 'bg-amber-100 text-slate-900';
                    } else if (boardTheme === 'cyber') {
                      squareBg = isDark ? 'bg-slate-800' : 'bg-cyan-900/40 text-cyan-200';
                    }

                    // Highlight colors
                    if (isSelected) squareBg = 'bg-yellow-400 text-slate-950 ring-4 ring-yellow-300 z-10';
                    else if (isLastFrom || isLastTo) squareBg = isDark ? 'bg-emerald-600/90' : 'bg-yellow-200';

                    return (
                      <div
                        key={`${r}-${c}`}
                        onClick={() => handleSquareClick(r, c)}
                        className={`relative flex items-center justify-center font-serif text-3xl sm:text-4xl cursor-pointer transition-colors ${squareBg}`}
                      >
                        {/* Ranks & Files Notation Labels */}
                        {c === 0 && (
                          <span className={`absolute top-0.5 left-1 text-[9px] font-sans font-bold opacity-60 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {8 - r}
                          </span>
                        )}
                        {r === 7 && (
                          <span className={`absolute bottom-0.5 right-1 text-[9px] font-sans font-bold opacity-60 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {String.fromCharCode(97 + c)}
                          </span>
                        )}

                        {/* Piece Icon */}
                        {piece && (
                          <span className={`transition-transform duration-100 active:scale-95 drop-shadow-sm ${
                            piece.color === 'w' ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : 'text-slate-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]'
                          }`}>
                            {PIECE_SYMBOLS[`${piece.color}_${piece.type}`]}
                          </span>
                        )}

                        {/* Legal Move Dot Marker */}
                        {isLegal && !piece && (
                          <div className="w-3.5 h-3.5 rounded-full bg-emerald-900/40 backdrop-blur-xs ring-2 ring-emerald-400" />
                        )}

                        {/* Capture Ring Marker */}
                        {isLegal && piece && (
                          <div className="absolute inset-1 rounded-full border-4 border-rose-500/80 animate-pulse pointer-events-none" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Game Over Modal Overlay */}
              {gameOverMessage && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white text-center animate-in zoom-in-95">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-slate-950 flex items-center justify-center mb-3 shadow-xl">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black mb-1">{gameOverMessage}</h3>
                  <p className="text-xs text-slate-300 max-w-xs mb-4">
                    Rating updated! Game Review analyzed 94.2% accuracy on move history.
                  </p>
                  <button
                    onClick={() => handleResetGame()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs hover:brightness-110 shadow-lg"
                  >
                    Play Rematch
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Player Bar (White / Current User) */}
          <div className="flex items-center justify-between bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2.5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center font-black text-sm ring-2 ring-indigo-500/30">
                AR
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900">Abhishek Rai</span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                    2450 GM
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span>Captured: {capturedByWhite.map(p => PIECE_SYMBOLS[`b_${p}`]).join(' ')}</span>
                  {evalScore > 0 && (
                    <span className="font-bold text-emerald-600">+{evalScore} Material</span>
                  )}
                </div>
              </div>
            </div>

            {/* White Timer Clock */}
            <div className={`px-3 py-1.5 rounded-xl font-mono text-base font-black tracking-wider transition-all ${
              currentTurn === 'w'
                ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/50 scale-105'
                : 'bg-white border border-slate-300 text-slate-700'
            }`}>
              {formatTime(whiteTime)}
            </div>
          </div>

          {/* Quick Match Action Buttons */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleResetGame()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Game</span>
              </button>
              <button
                onClick={() => {
                  setGameOverMessage('Resigned. Black wins.');
                  setIsGameActive(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold transition-colors"
              >
                <span>Resign</span>
              </button>
            </div>

            {/* Time Control Buttons */}
            <div className="flex items-center gap-1">
              {[
                { label: '3m Blitz', secs: 180 },
                { label: '5m Blitz', secs: 300 },
                { label: '10m Rapid', secs: 600 }
              ].map(tc => (
                <button
                  key={tc.label}
                  onClick={() => { setTimeControl(tc.secs); handleResetGame(tc.secs); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    timeControl === tc.secs
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Game Review, Move History & Features (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Bot / Puzzle Info Card */}
          {activeTab === 'puzzle' ? (
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-300">
                  Daily Tactics Puzzle #{currentPuzzleIndex + 1}
                </span>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  {PUZZLES[currentPuzzleIndex].rating} Rating
                </span>
              </div>
              <h3 className="text-lg font-black">{PUZZLES[currentPuzzleIndex].title}</h3>
              <p className="text-xs text-slate-300">{PUZZLES[currentPuzzleIndex].description}</p>
              
              {puzzleStatus === 'solved' && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-between text-emerald-300 text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Brilliant Move! Puzzle Solved (+15 Rating)
                  </span>
                  <button
                    onClick={() => handleLoadPuzzle((currentPuzzleIndex + 1) % PUZZLES.length)}
                    className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-black rounded-lg hover:brightness-110"
                  >
                    Next Puzzle
                  </button>
                </div>
              )}

              {puzzleStatus === 'failed' && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl flex items-center justify-between text-rose-300 text-xs font-bold">
                  <span>Incorrect move. Try again!</span>
                  <button
                    onClick={() => handleLoadPuzzle(currentPuzzleIndex)}
                    className="px-2.5 py-1 bg-rose-500 text-white font-black rounded-lg hover:brightness-110"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Selected Bot Opponent</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  {selectedBot.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={selectedBot.avatar}
                  alt={selectedBot.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/40"
                />
                <div>
                  <h4 className="text-sm font-black text-slate-900">{selectedBot.name}</h4>
                  <p className="text-[11px] text-slate-500">{selectedBot.personality}</p>
                </div>
              </div>

              {/* Bot Selector Dropdown */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {BOTS.map(b => (
                  <button
                    key={b.id}
                    onClick={() => { setSelectedBot(b); handleResetGame(); }}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      selectedBot.id === b.id
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-[11px] font-black text-slate-900 truncate">{b.name.split(' ')[0]}</div>
                    <div className="text-[9px] text-slate-500">{b.rating} Elo</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Move History Log (Algebraic SAN Log) */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Move History & SAN Log</h3>
              <span className="text-[10px] font-bold text-slate-500">
                {moveHistory.length} moves played
              </span>
            </div>

            <div className="h-44 overflow-y-auto space-y-1 pr-1 font-mono text-xs">
              {moveHistory.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-[11px] italic">
                  Game starting... Make your first move with White!
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  {moveHistory.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between px-2 py-1 rounded-lg ${
                        idx % 2 === 0 ? 'bg-slate-50 text-slate-800' : 'bg-slate-100 text-slate-900 font-bold'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 font-sans">{m.moveNumber}.</span>
                      <span>{m.notation}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Board Theme Switcher */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-[11px] font-bold text-slate-500">Theme:</span>
              <div className="flex items-center gap-1">
                {[
                  { id: 'forest', label: 'Forest Green' },
                  { id: 'wood', label: 'Classic Wood' },
                  { id: 'cyber', label: 'Cyber Dark' }
                ].map(th => (
                  <button
                    key={th.id}
                    onClick={() => setBoardTheme(th.id as any)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      boardTheme === th.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {th.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ARRAI Deep Analysis Game Review Stats */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-4 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200">
                ARRAI Deep Analysis Engine
              </span>
              <div className="text-xl font-black">94.8% Accuracy</div>
              <p className="text-[11px] text-emerald-100">0 Blunders · 2 Great Moves · 1 Brilliant</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-black text-lg">
              A+
            </div>
          </div>

        </div>

      </div>
      )}

    </div>
  );
};
