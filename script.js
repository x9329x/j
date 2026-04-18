const OWNER = 'x9329x'; // 본인 ID로 수정
const REPO = 'x9329x.github.io'; // 리포지토리 이름


async function init() {
    const grid = document.getElementById('grid-container');
    const feed = document.getElementById('feed');

    // 잔디판 생성 (최근 100일 기준 - 화면 크기에 맞춤)
    const today = new Date();
    for (let i = 366; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0].replace(/-/g, '.');
        
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-date', dateStr);
        grid.appendChild(cell);
    }

    try {
        // GitHub API로 _posts 폴더 파일 목록 조회
        const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/_posts`);
        const files = await response.json();

        if (!Array.isArray(files)) {
            feed.innerHTML = '<div class="loading">아직 게시물이 없습니다.</div>';
            return;
        }

        files.reverse(); // 최신순 정렬
        feed.innerHTML = '';

        for (const file of files) {
            if (file.name === '.gitkeep') continue;

            const res = await fetch(file.download_url);
            const rawText = await res.text();

            // 파싱 로직
            const authorMatch = rawText.match(/author: "(.*)"/);
            const dateMatch = rawText.match(/date: "(.*)"/);
            const imgMatch = rawText.match(/image: "(.*)"/);
            
            const author = authorMatch ? authorMatch[1] : 'User';
            const dateStr = dateMatch ? dateMatch[1] : '';
            const content = rawText.split('---').pop().trim();
            const imageHtml = imgMatch ? `<img src="${imgMatch[1]}" class="post-image">` : '';

            // 게시물 추가
            const postHtml = `
                <article class="post">
                    <div class="post-header">
                        <span class="author">${author}</span>
                        <span class="date">· ${dateStr}</span>
                    </div>
                    <div class="post-content">${marked.parse(content)}</div>
                    ${imageHtml}
                </article>
            `;
            feed.insertAdjacentHTML('beforeend', postHtml);

            // 해당 날짜 잔디 색칠
            if (dateStr) {
                const pureDate = dateStr.split(' ')[0];
                const targetCell = document.querySelector(`[data-date="${pureDate}"]`);
                if (targetCell) targetCell.classList.add('active');
            }
        }
    } catch (e) {
        console.error(e);
        feed.innerHTML = '<div class="loading">데이터 로드 오류</div>';
    }
}

init();
