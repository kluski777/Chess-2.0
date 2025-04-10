// okej zróbmy tak że będą normalne wersje ale też i te z shufflowaniem
export const beginPositions = {
    'variant a': [
        ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook'],
        ['Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn'],
        ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook']
    ].map((array, index) => array.map( type => {
        return {
            isWhite: index < 3,
            type: type
        }
    })),
    'customGame': [
        'let the user decide, just draw the chessboard',
    ]
}