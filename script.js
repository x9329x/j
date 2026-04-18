const OWNER = 'x9329x'; // 본인 ID로 수정
const REPO = 'x9329x.github.io'; // 리포지토리 이름

async function initBlog() {
    const grid = document.getElementById('grid-container');
    const feed = document.getElementById('feed');

    // 1. 잔디 365개 미리 생성
    const today = new Date();
    for (let i = 0; i < 365; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        // 날짜 계산을 위해 역순으로 데이터 속성 부여 가능
        grid.appendChild(cell);
    }

    try {
        // 2. _posts 폴더(또는 posts) 파일 목록 가져오기
        const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/_posts`);
        const files = await response.json();

        if (!Array.isArray(files)) return;

        // 최신순 정렬
        files.reverse();

        feed.innerHTML = ''; // "로딩 중" 문구 제거

        for (const file of files) {
            if (file.name === '.gitkeep') continue;

            // 3. 개별 파일 내용 읽기
            const res = await fetch(file.download_url);
            const rawText = await res.text();

            // 4. 데이터 파싱 (날짜, 본문 분리)
            const dateMatch = rawText.match(/date: "(.*)"/);
            const dateStr = dateMatch ? dateMatch[1] : '날짜 미상';
            
            // --- 구분자로 본문만 추출
            const content = rawText.split('---').pop().trim();

            // 5. 피드 아이템 생성
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <div class="post-date">${dateStr}</div>
                <div class="post-content">${content.replace(/\n/g, '<br>')}</div>
            `;
            feed.appendChild(postElement);

            // 6. 오늘 게시물이라면 첫 번째 잔디 색칠 (단순화된 로직)
            const firstCell = document.querySelector('.cell');
            if (firstCell) firstCell.classList.add('active');
        }
    } catch (error) {
        console.error("데이터 로드 중 오류:", error);
        feed.innerHTML = "<p>게시물을 불러오지 못했습니다. API 제한이나 설정을 확인하세요.</p>";
    }
}

initBlog();
