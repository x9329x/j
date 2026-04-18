const OWNER = 'x9329x'; // 본인 ID로 수정
const REPO = 'x9329x.github.io'; // 리포지토리 이름

async function initBlog() {
    const feed = document.getElementById('feed');
    const grid = document.getElementById('grid-container');

    try {
        const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/_posts`);
        const files = await response.json();
        if (!Array.isArray(files)) return;

        files.reverse();
        feed.innerHTML = ''; 

        for (const file of files) {
            if (file.name === '.gitkeep') continue;

            const res = await fetch(file.download_url);
            const rawText = await res.text();

            // 데이터 파싱
            const dateMatch = rawText.match(/date: "(.*)"/);
            const dateStr = dateMatch ? dateMatch[1] : '날짜 미상';
            const content = rawText.split('---').pop().trim();

            // 이미지 태그 처리 (이미지가 없을 경우를 대비)
            const imageMatch = rawText.match(/image: "(.*)"/);
            const imageTag = imageMatch ? `<img src="${imageMatch[1]}" class="post-image">` : '';

            // ---------------------------------------------------------
            // // 여기! // 이 부분이 질문하신 코드가 들어가는 위치입니다.
            // ---------------------------------------------------------
            const postHtml = `
                <article class="post">
                    <div class="post-header">
                        <span class="author">User</span>
                        <span class="date">· ${dateStr}</span>
                    </div>
                    <div class="post-content">${content.replace(/\n/g, '<br>')}</div>
                    ${imageTag} 
                </article>
            `;
            feed.insertAdjacentHTML('beforeend', postHtml);
            // ---------------------------------------------------------

            // 잔디 색칠 (날짜 기반 로직 생략)
        }
    } catch (error) {
        console.error("오류 발생:", error);
    }
}

initBlog();
