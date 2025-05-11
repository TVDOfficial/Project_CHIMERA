// js/widgets/snakeGameWidget.js

export function setupSnakeGameWidget(widgetEl, conf) {
    const body = widgetEl.querySelector('.widget-body'); if (!body) return;
    const instructionsEl = document.createElement('div'); instructionsEl.className = 'snake-instructions'; instructionsEl.innerHTML = `Arrows to Move. Refresh <i class="fas fa-sync-alt"></i> to Restart.`;
    const canvas = document.createElement('canvas'); canvas.id = `snakeCanvas-${conf.id}`;
    const scoreDisplayEl = document.createElement('div'); scoreDisplayEl.className = 'snake-score-display'; scoreDisplayEl.innerHTML = `Score: <span id="snakeScoreVal-${conf.id}">0</span>`;
    const gameOverMsgEl = document.createElement('div'); gameOverMsgEl.id = `snakeGameOverMsg-${conf.id}`; gameOverMsgEl.className = 'snake-game-over'; gameOverMsgEl.style.display = 'none'; gameOverMsgEl.textContent = 'Game Over! Press Enter or Refresh to Restart.';
    body.innerHTML = ''; body.append(instructionsEl, canvas, scoreDisplayEl, gameOverMsgEl);

    const scoreValEl = widgetEl.querySelector(`#snakeScoreVal-${conf.id}`);
    const ctx = canvas.getContext('2d');
    const gridSize = 15;
    let tileCountX, tileCountY, snake, food, dx, dy, score, gameLoopInterval, gameActive;

    function resizeAndInit() {
        if (!body || !instructionsEl || !scoreDisplayEl || !canvas) return;
        const widgetBodyStyle = getComputedStyle(body);
        const paddingY = parseFloat(widgetBodyStyle.paddingTop) + parseFloat(widgetBodyStyle.paddingBottom);
        const paddingX = parseFloat(widgetBodyStyle.paddingLeft) + parseFloat(widgetBodyStyle.paddingRight);
        const textHeight = instructionsEl.offsetHeight + scoreDisplayEl.offsetHeight + (gameOverMsgEl.style.display !== 'none' ? gameOverMsgEl.offsetHeight : 0) + 10;

        let availableWidth = body.clientWidth - paddingX - 2;
        let availableHeight = body.clientHeight - paddingY - textHeight - 2;

        tileCountX = Math.max(10, Math.floor(availableWidth / gridSize));
        tileCountY = Math.max(10, Math.floor(availableHeight / gridSize));
        canvas.width = tileCountX * gridSize; canvas.height = tileCountY * gridSize;
        initGameLogic();
    }
    widgetEl.onWidgetResize = resizeAndInit;

    function initGameLogic() {
        if (gameLoopInterval) clearInterval(gameLoopInterval);
        snake = [{ x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2) }];
        dx = 0; dy = 0; // Snake starts stationary
        score = 0; if (scoreValEl) scoreValEl.textContent = score;
        if (gameOverMsgEl) gameOverMsgEl.style.display = 'none';
        placeFood(); gameActive = true;

        // Start the game loop immediately
        gameLoopInterval = setInterval(gameLoop, 150);
        widgetEl.dataset.snakeGameInterval = String(gameLoopInterval); // Store interval ID

        if (widgetEl.snakeKeydownHandler) document.removeEventListener('keydown', widgetEl.snakeKeydownHandler);
        widgetEl.snakeKeydownHandler = handleKeyPress; document.addEventListener('keydown', widgetEl.snakeKeydownHandler);
        drawGame(); // Draw the initial state of the game
    }    function placeFood() { food = { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY) }; for (let p of snake) if (p.x === food.x && p.y === food.y) { placeFood(); return; } }

    function gameLoop() {
        if (!gameActive) return;
        if (dx === 0 && dy === 0) {
             drawGame();
             return;
        }

        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) return gameOver();
        for (let i = 0; i < snake.length; i++) {
             if (head.x === snake[i].x && head.y === snake[i].y) return gameOver();
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++; if (scoreValEl) scoreValEl.textContent = score;
            placeFood();
        } else {
            snake.pop();
        }
        drawGame();
    }
    function drawGame() {
        if (!ctx || !canvas || !food) return;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--current-accent-tertiary').trim();
        ctx.fillRect(food.x * gridSize + 1, food.y * gridSize + 1, gridSize -2 , gridSize -2 );
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--current-accent-primary').trim();
        snake.forEach(p => { ctx.fillRect(p.x * gridSize + 1, p.y * gridSize + 1, gridSize -2, gridSize -2); });
    }
    function gameOver() {
        gameActive = false;
        if(gameLoopInterval) clearInterval(gameLoopInterval);
        widgetEl.dataset.snakeGameInterval = null;
        if (gameOverMsgEl) gameOverMsgEl.style.display = 'block';
        resizeAndInit(); // Recalculate sizes as game over message might change layout
    }
    function handleKeyPress(e) {
        const activeEl = document.activeElement;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
             if (!activeEl || (activeEl.tagName !== 'INPUT' && activeEl.tagName !== 'TEXTAREA')) {
                if (widgetEl.contains(e.target) || document.activeElement === document.body || document.getElementById('dashboardGrid').contains(document.activeElement) ) {
                     e.preventDefault();
                }
             }
        }

        if (e.key === 'Enter' && !gameActive && gameOverMsgEl?.style.display === 'block') { resizeAndInit(); return; }
        if (!gameActive) return;

        let newDx = dx, newDy = dy;
        switch (e.key) {
            case 'ArrowUp': if (dy === 0) { newDx = 0; newDy = -1; } break;
            case 'ArrowDown': if (dy === 0) { newDx = 0; newDy = 1; } break;
            case 'ArrowLeft': if (dx === 0) { newDx = -1; newDy = 0; } break;
            case 'ArrowRight': if (dx === 0) { newDx = 1; newDy = 0; } break;
            default: return;
        }

        // Prevent the snake from reversing onto itself
        if (snake.length > 1 && newDx === -dx && newDy === -dy ) {
            // If trying to reverse, do nothing (keep current dx, dy)
        } else {
            dx = newDx; dy = newDy;
        }

        // The game loop is now started in initGameLogic, so the block that was here is removed.
    }
    resizeAndInit();
    const refreshBtn = widgetEl.querySelector(`[data-action="refresh-${conf.id}"]`); if (refreshBtn) { refreshBtn.title = "Restart Game"; refreshBtn.addEventListener('click', resizeAndInit); }
}