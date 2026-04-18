const OWNER = 'x9329x'; // 본인 ID로 수정
const REPO = 'x9329x.github.io'; // 리포지토리 이름

async function init() {
    const grid = document.getElementById('grid-container');
    const feed = document.getElementById('feed');

    // 1. 잔디판 생성 (최근 53주 = 371일)
    const today = new Date();
    // 일요일(0)부터 시작하도록 보정하여 371개 생성
    for (let i = 0; i < 371; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        
        const d = new Date();
        d.setDate(today.getDate() - (370 - i));
        const dateKey = d.toISOString().split('T')[0].replace(/-/g, '.');
        
        cell.setAttribute('data-date', dateKey); // "2026.04.19" 형태
        grid.appendChild(cell);
    }

    try {
        const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/_posts`);
        const files = await response.json();

        if (!Array.isArray(files)) {
            feed.innerHTML = '<p style="padding:20px;">아직 게시물이 없습니다.</p>';
            return;
        }

        files.reverse();
        feed.innerHTML = '';

        for (const file of files) {
            if (file.name === '.gitkeep') continue;

            const res = await fetch(file.download_url);
            const rawText = await res.text();

            const dateMatch = rawText.match(/date: "(.*)"/);
            const dateStr = dateMatch ? dateMatch[1] : '';
            const content = rawText.split('---').pop().trim();

            const postHtml = `
                <article class="post">
                    <div class="post-header">
                        <span class="author">User</span>
                        <span class="date">· ${dateStr}</span>
                    </div>
                    <div class="post-content">${marked.parse(content)}</div>
                </article>
            `;
            feed.insertAdjacentHTML('beforeend', postHtml);

            // 해당 날짜 잔디 색칠 (날짜 부분만 추출)
            if (dateStr) {
                const pureDate = dateStr.split(' ')[0]; // "2026.04.19"
                const targetCell = document.querySelector(`[data-date="${pureDate}"]`);
                if (targetCell) {
                    targetCell.classList.add('active');
                }
            }
        }
    } catch (e) {
        console.error("데이터 로드 오류:", e);
        feed.innerHTML = '<p style="padding:20px;">게시물을 불러오지 못했습니다.</p>';
    }
}

init();
