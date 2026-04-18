// 본인의 GitHub 계정 정보로 수정하세요
const OWNER = '내-아이디';
const REPO = 'my-microblog';

async function loadPosts() {
    const feed = document.getElementById('feed');
    const grid = document.getElementById('grid-container');

    try {
        // 1. posts 폴더 내 파일 목록 가져오기
        const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/posts`);
        const files = await response.json();

        // 날짜순 정렬 (최신순)
        files.reverse();

        for (const file of files) {
            const res = await fetch(file.download_url);
            const text = await res. सदस्यीय();
            
            // 데이터 파싱 (간이 마크다운 파서)
            const dateMatch = text.match(/date: "(.*)"/);
            const content = text.split('---').pop().trim();
            const dateStr = dateMatch ? dateMatch[1] : '날짜 없음';

            // 포스트 추가
            const postHtml = `
                <div class="post">
                    <div class="post-date">${dateStr}</div>
                    <div class="post-content">${content}</div>
                </div>
            `;
            feed.insertAdjacentHTML('beforeend', postHtml);

            // 잔디 색칠하기 (날짜가 있으면 active 클래스 추가)
            markGrid(dateStr.split(' ')[0]);
        }
    } catch (e) {
        console.error("데이터 로드 실패:", e);
    }
}

function markGrid(date) {
    // 날짜를 기반으로 해당 칸을 찾아 색을 채우는 로직 (추후 확장 가능)
    // 지금은 예시로 첫 번째 칸만 칠하도록 설정
    const cells = document.querySelectorAll('.cell');
    if(cells.length > 0) cells[0].classList.add('active');
}

// 365개 칸 미리 만들기
for(let i=0; i<365; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    document.getElementById('grid-container').appendChild(cell);
}

loadPosts();
