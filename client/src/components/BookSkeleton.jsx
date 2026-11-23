// Stretch: skeleton placeholder shown while books are loading.
export default function BookSkeleton() {
  return (
    <div className="card skeleton" aria-hidden="true">
      <div className="card-cover sk-block" />
      <div className="card-body">
        <div className="sk-line wide sk-block" />
        <div className="sk-line sk-block" />
        <div className="sk-line short sk-block" />
      </div>
    </div>
  );
}
