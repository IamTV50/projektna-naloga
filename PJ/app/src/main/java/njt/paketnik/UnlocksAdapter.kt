package njt.paketnik

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import java.text.SimpleDateFormat
import java.util.Locale

class UnlocksAdapter(context: Context, private val unlocksList: List<UnlocksActivity.Unlock>) : ArrayAdapter<UnlocksActivity.Unlock>(context, R.layout.unlock_item, unlocksList) {
    private val inflater: LayoutInflater = LayoutInflater.from(context)
    private val resources = context.resources

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        var view = convertView
        val holder: ViewHolder

        if (view == null) {
            view = inflater.inflate(R.layout.unlock_item, parent, false)
            holder = ViewHolder()
            holder.numberTextView = view.findViewById(R.id.unlockNumber)
            holder.dateTextView = view.findViewById(R.id.unlockDate)
            holder.successTextView = view.findViewById(R.id.unlockSuccess)
            holder.reasonTextView = view.findViewById(R.id.unlockReason)
            view.tag = holder
        } else {
            holder = view.tag as ViewHolder
        }

        val unlock = unlocksList[position]
        val inputDateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.ENGLISH)
        val outputDateFormat = SimpleDateFormat("dd.MM.yyyy hh:mm:ss", Locale.ENGLISH)

        holder.numberTextView?.text = resources.getString(R.string.unlockNumber, unlock.number.toString())
        holder.dateTextView?.text = resources.getString(R.string.unlockNumber, inputDateFormat.parse(unlock.date)?.let { outputDateFormat.format(it) } ?: "")
        holder.successTextView?.text = resources.getString(R.string.unlockNumber, if (unlock.success) "Successfully" else "Unsuccessfully")
        holder.reasonTextView?.text = resources.getString(R.string.unlockNumber, unlock.reason)

        return view!!
    }

    private class ViewHolder {
        var numberTextView: TextView? = null
        var dateTextView: TextView? = null
        var successTextView: TextView? = null
        var reasonTextView: TextView? = null
    }
}