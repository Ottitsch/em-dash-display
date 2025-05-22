// Responsive D3 bar chart for em_dash_percent by subreddit (top 10 per selected month)
function renderChart(data, selectedMonth) {
    let filtered = data.filter(d => d.month === selectedMonth);
    let chartData = filtered
        .map(d => ({ subreddit: d.subreddit, em_dash_percent: +d.em_dash_percent }))
        .filter(d => d.em_dash_percent > 0)
        .sort((a, b) => b.em_dash_percent - a.em_dash_percent)
        .slice(0, 10);

    const width = 800, height = 400, margin = {top: 40, right: 30, bottom: 80, left: 80};
    const svg = d3.select('#svg_plot')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .style('width', '100%')
        .style('height', '100%');
    svg.selectAll('*').remove(); // Clear previous

    // Tooltip div (reuse or create)
    let tooltip = d3.select('body').selectAll('.bar-tooltip').data([null]).join('div')
        .attr('class', 'bar-tooltip')
        .style('position', 'absolute')
        .style('background', 'rgba(255,255,255,0.95)')
        .style('border', '1px solid #aaa')
        .style('padding', '6px 10px')
        .style('border-radius', '4px')
        .style('pointer-events', 'none')
        .style('font-size', '14px')
        .style('display', 'none');

    const x = d3.scaleBand()
        .domain(chartData.map(d => d.subreddit))
        .range([margin.left, width - margin.right])
        .padding(0.2);
    const y = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.em_dash_percent)]).nice()
        .range([height - margin.bottom, margin.top]);

    svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-40)')
        .style('text-anchor', 'end');

    svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    svg.selectAll('.bar')
        .data(chartData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.subreddit))
        .attr('y', d => y(d.em_dash_percent))
        .attr('width', x.bandwidth())
        .attr('height', d => y(0) - y(d.em_dash_percent))
        .attr('fill', 'steelblue')
        .on('mouseover', function(event, d) {
            tooltip.style('display', 'block')
                .html(`<strong>${d.subreddit}</strong><br>Em Dash %: <strong>${d.em_dash_percent.toFixed(2)}</strong>`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
            d3.select(this).attr('fill', '#ff9800');
        })
        .on('mousemove', function(event) {
            tooltip.style('left', (event.pageX + 10) + 'px')
                   .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            tooltip.style('display', 'none');
            d3.select(this).attr('fill', 'steelblue');
        });

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', margin.top / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .text(`Top 10 Subreddits by Em Dash Percent (${selectedMonth})`);
}

d3.csv('/static/data/analysis.csv').then(data => {
    // Filter out data from 2025
    data = data.filter(d => !d.month.startsWith('2025'));

    let months = Array.from(new Set(data.map(d => d.month)));
    months.sort().reverse();
    const monthSelect = d3.select('#month_select');
    monthSelect.selectAll('option')
        .data(months)
        .join('option')
        .attr('value', d => d)
        .text(d => d);
    let initialMonth = months[0];
    renderChart(data, initialMonth);
    monthSelect.on('change', function() {
        renderChart(data, this.value);
    });
}); 