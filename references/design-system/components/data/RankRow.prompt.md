A single ranking / podium row — position badge, avatar, driver name + meta (UF), points, optional trailing chevron. Stack inside a `Card`, separated by 1px `--border-light` dividers.

```jsx
<RankRow position={1} name="Lucas Almeida" meta="PR" points={316} podium
         trailing={<ChevronIcon/>} onClick={openProfile} />
<RankRow position={4} name="Rafael Souza" meta="SP" points={197} />
```

`podium` colors the top-3 badges red/black/graphite. Use for both the home podium (top 5) and the full ranking list.
